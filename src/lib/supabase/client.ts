import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnabled } from "./enabled";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Get a shared browser Supabase client (returns null if not configured) */
export function getSupabase() {
  if (!supabaseEnabled) return null;
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
