'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Sign in with Google OAuth
 * Redirects to Google for authentication, then returns to the specified redirect URL
 */
export async function signInWithGoogle(redirectTo: string = '/') {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
    },
  })

  if (error) {
    console.error('Sign in error:', error)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: 'Failed to get OAuth URL' }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
    return { error: error.message }
  }

  redirect('/')
}

/**
 * Get the current authenticated user
 */
export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Get user error:', error)
    return { user: null, error: error.message }
  }

  return { user, error: null }
}

/**
 * Get or create profile for the current user
 * Called after first sign in to set up user profile
 */
export async function getOrCreateProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { profile: null, error: 'Not authenticated' }
  }

  // Check if profile exists
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (existingProfile) {
    return { profile: existingProfile, error: null }
  }

  // Create profile if it doesn't exist
  const username = user.email?.split('@')[0] || `user${user.id.slice(0, 8)}`
  const displayName = user.user_metadata?.full_name || username

  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username,
      display_name: displayName,
      avatar_url: user.user_metadata?.avatar_url || null,
    })
    .select()
    .single()

  if (createError) {
    console.error('Create profile error:', createError)
    return { profile: null, error: createError.message }
  }

  return { profile: newProfile, error: null }
}

/**
 * Get profile by user ID
 */
export async function getProfile(userId: string) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Get profile error:', error)
    return { profile: null, error: error.message }
  }

  return { profile, error: null }
}
