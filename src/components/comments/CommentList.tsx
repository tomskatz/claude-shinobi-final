'use client'

import { CommentItem } from './CommentItem'
import type { CommentWithAuthor } from '@/lib/types/comments'
import { MessageCircle } from 'lucide-react'

interface CommentListProps {
  comments: CommentWithAuthor[]
  currentUserId?: string
  onCommentDeleted: (commentId: string) => void
  onCommentUpdated: (commentId: string, newContent: string) => void
}

/**
 * Client Component: Displays list of comments
 * Shows empty state if no comments exist
 */
export function CommentList({
  comments,
  currentUserId,
  onCommentDeleted,
  onCommentUpdated,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface p-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No comments yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Be the first to share your thoughts!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={currentUserId === comment.user_id}
          onDelete={onCommentDeleted}
          onUpdate={onCommentUpdated}
        />
      ))}
    </div>
  )
}
