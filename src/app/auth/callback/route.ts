import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Auth callback route handler
 * Handles OAuth redirect from Supabase and creates/updates user profile
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/'

  if (code) {
    const supabase = await createClient()

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Auth exchange error:', exchangeError)
      return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin))
    }

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      // Create profile if it doesn't exist
      if (!existingProfile) {
        const username = user.email?.split('@')[0] || `user${user.id.slice(0, 8)}`
        const displayName = user.user_metadata?.full_name || username

        await supabase.from('profiles').insert({
          id: user.id,
          username,
          display_name: displayName,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
      }
    }

    // Redirect to the specified path
    return NextResponse.redirect(new URL(redirect, requestUrl.origin))
  }

  // No code provided, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
