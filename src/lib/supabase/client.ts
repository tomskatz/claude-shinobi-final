import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database.types'

/**
 * Creates a Supabase client for use in browser (Client Components)
 * Automatically handles cookie-based session management
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
