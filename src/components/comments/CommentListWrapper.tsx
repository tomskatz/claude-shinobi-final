'use client'

import { useAuth } from '@/hooks/useAuth'
import { AuthPrompt } from './AuthPrompt'
import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import type { CommentWithAuthor } from '@/lib/types/comments'
import { useState } from 'react'

interface CommentListWrapperProps {
  postSlug: string
  initialComments: CommentWithAuthor[]
}

/**
 * Client Component: Wrapper for comment list with form and real-time updates
 * Manages comment state and handles optimistic updates
 */
export function CommentListWrapper({
  postSlug,
  initialComments,
}: CommentListWrapperProps) {
  const { user, loading } = useAuth()
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)

  // Handle new comment added via form
  const handleCommentAdded = (newComment: CommentWithAuthor) => {
    setComments((prev) => [...prev, newComment])
  }

  // Handle comment deleted
  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  // Handle comment updated
  const handleCommentUpdated = (commentId: string, newContent: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, content: newContent, edited_at: new Date().toISOString() }
          : c
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Form or Auth Prompt */}
      {user ? (
        <CommentForm postSlug={postSlug} onCommentAdded={handleCommentAdded} />
      ) : (
        <AuthPrompt />
      )}

      {/* Comments List */}
      <CommentList
        comments={comments}
        currentUserId={user?.id}
        onCommentDeleted={handleCommentDeleted}
        onCommentUpdated={handleCommentUpdated}
      />
    </div>
  )
}
