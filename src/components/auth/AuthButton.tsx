'use client'

import { useAuth } from '@/hooks/useAuth'
import { signInWithGoogle, signOut } from '@/lib/actions/auth'
import { LogIn, LogOut, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/**
 * Authentication button component for header
 * Shows sign in button for guests, user menu for authenticated users
 */
export function AuthButton() {
  const { user, profile, loading } = useAuth()
  const pathname = usePathname()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    setIsSigningIn(true)
    await signInWithGoogle(pathname)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
    )
  }

  if (!user || !profile) {
    return (
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <LogIn className="h-4 w-4" />
        {isSigningIn ? 'Signing in...' : 'Sign In'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="text-sm font-medium text-foreground">
          {profile.display_name}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </div>
  )
}
