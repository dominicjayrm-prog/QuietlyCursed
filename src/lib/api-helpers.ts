import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client authenticated with the caller's Bearer token.
 * Returns null if env vars or token are missing.
 */
export function getAuthClient(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Create a Supabase client with the service role key (bypasses RLS).
 * Returns null if env vars are missing.
 */
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Verify the caller is an authenticated Supabase user.
 * Returns the user on success, or a 401 NextResponse on failure.
 */
export async function requireAuth(request: Request) {
  const supabase = getAuthClient(request);
  if (!supabase) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { user };
}

/**
 * Return a safe 500 response — logs the real error server-side but
 * only sends a generic message to the client.
 */
export function safeError(context: string, err: unknown, status = 500) {
  const detail = err instanceof Error ? err.message : String(err);
  console.error(`[${context}]`, detail);
  return NextResponse.json(
    { error: "An internal error occurred. Please try again later." },
    { status }
  );
}

/** Allowed image MIME types for uploads. */
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

/** Maximum upload file size in bytes (5 MB). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Validate an image file before upload.
 * Returns an error string if invalid, or null if OK.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return `Invalid file type "${file.type}". Only PNG, JPEG, and WebP images are allowed.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB.`;
  }
  return null;
}
