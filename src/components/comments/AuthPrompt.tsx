'use client'

import { signInWithGoogle } from '@/lib/actions/auth'
import { LogIn, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

/**
 * Prompt component to encourage users to sign in to comment
 * Displayed in place of comment form for unauthenticated users
 */
export function AuthPrompt() {
  const pathname = usePathname()
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    setIsSigningIn(true)
    await signInWithGoogle(pathname)
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6 text-center">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-primary/10 p-3">
          <MessageCircle className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Join the conversation
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Sign in with Google to leave a comment and engage with the community.
      </p>
      <button
        onClick={handleSignIn}
        disabled={isSigningIn}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <LogIn className="h-4 w-4" />
        {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  )
}
