import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a singleton instance to avoid multiple instances
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export async function createClient() {
  if (supabaseClient) return supabaseClient

  // Use the public URL directly from environment
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!

  // Use the public anon key from the environment
  // This is safe because it's injected at build time and is meant to be public
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  supabaseClient = createBrowserClient<Database>(url, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseClient
}
