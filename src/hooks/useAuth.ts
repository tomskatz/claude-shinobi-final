'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
}

/**
 * Hook to get current auth state and profile
 * Subscribes to auth state changes
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Fetch profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // Fetch profile on auth change
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
          })
      } else {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    profile,
    loading,
    isAdmin: profile?.is_admin ?? false,
  }
}
