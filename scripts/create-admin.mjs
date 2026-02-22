#!/usr/bin/env node

/**
 * Create an admin user for the Quietly Cursed admin panel.
 *
 * Usage:
 *   node scripts/create-admin.mjs
 *
 * Requires these env vars in .env.local (or exported in your shell):
 *   NEXT_PUBLIC_SUPABASE_URL        – your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY       – service_role key (Settings > API in Supabase dashboard)
 *
 * The service_role key is needed (not the anon key) because it bypasses
 * email-confirmation requirements and creates a fully verified user immediately.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createInterface } from "readline";

// ── Load .env.local ─────────────────────────────────────────────────
function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local doesn't exist – that's fine, we'll check vars below
  }
}

loadEnvFile();

// ── Validate required env vars ──────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("\n❌  Missing environment variables.\n");
  if (!supabaseUrl) {
    console.error("  • NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceRoleKey) {
    console.error("  • SUPABASE_SERVICE_ROLE_KEY is not set");
    console.error("    (Find it in Supabase dashboard → Settings → API → service_role key)");
  }
  console.error("\nAdd them to .env.local and try again.\n");
  process.exit(1);
}

// ── Prompt helper ───────────────────────────────────────────────────
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔧  Quietly Cursed – Create Admin User\n");

  const email = await prompt("  Email: ");
  if (!email) {
    console.error("  Email is required.");
    process.exit(1);
  }

  const password = await prompt("  Password (min 6 characters): ");
  if (!password || password.length < 6) {
    console.error("  Password must be at least 6 characters.");
    process.exit(1);
  }

  // Create a Supabase admin client using the service_role key
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("\n  Creating user...");

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip email verification
  });

  if (error) {
    console.error(`\n❌  Failed to create user: ${error.message}\n`);
    process.exit(1);
  }

  console.log(`\n✅  Admin user created successfully!`);
  console.log(`    Email: ${data.user.email}`);
  console.log(`    ID:    ${data.user.id}`);
  console.log(`\n  You can now sign in at /admin/login\n`);
}

main();
