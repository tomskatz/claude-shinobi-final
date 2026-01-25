'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { createComment } from '@/lib/actions/comments'
import type { CommentWithAuthor } from '@/lib/types/comments'

interface CommentFormProps {
  postSlug: string
  onCommentAdded: (comment: CommentWithAuthor) => void
}

/**
 * Client Component: Form for submitting new comments
 * Includes character counter and validation
 */
export function CommentForm({ postSlug, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const characterCount = content.length
  const maxCharacters = 5000
  const isOverLimit = characterCount > maxCharacters
  const isValid = content.trim().length > 0 && !isOverLimit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) {
      setError('Please enter a valid comment')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const result = await createComment(postSlug, content)

    if (result.success && result.data) {
      setContent('')
      onCommentAdded(result.data)
    } else {
      setError(result.error || 'Failed to post comment')
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full rounded-lg border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={4}
          disabled={isSubmitting}
        />
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`text-xs ${
              isOverLimit ? 'text-danger' : 'text-muted-foreground'
            }`}
          >
            {characterCount} / {maxCharacters} characters
          </span>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">
          {error}
        </div>
      )}
    </form>
  )
}
