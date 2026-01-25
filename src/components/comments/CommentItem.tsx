'use client'

import { useState } from 'react'
import { Edit2, Trash2, Check, X, User } from 'lucide-react'
import type { CommentWithAuthor } from '@/lib/types/comments'
import { deleteComment, updateComment } from '@/lib/actions/comments'
import { formatDistanceToNow } from '@/lib/utils/dateFormat'

interface CommentItemProps {
  comment: CommentWithAuthor
  isOwner: boolean
  onDelete: (commentId: string) => void
  onUpdate: (commentId: string, newContent: string) => void
}

/**
 * Client Component: Individual comment display with edit/delete actions
 * Shows comment content, author info, and timestamp
 */
export function CommentItem({
  comment,
  isOwner,
  onDelete,
  onUpdate,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setIsDeleting(true)
    setError(null)

    const result = await deleteComment(comment.id)

    if (result.success) {
      onDelete(comment.id)
    } else {
      setError(result.error || 'Failed to delete comment')
      setIsDeleting(false)
    }
  }

  const handleSaveEdit = async () => {
    if (editContent.trim() === comment.content.trim()) {
      setIsEditing(false)
      return
    }

    if (editContent.trim().length === 0) {
      setError('Comment cannot be empty')
      return
    }

    setIsSaving(true)
    setError(null)

    const result = await updateComment(comment.id, editContent)

    if (result.success) {
      onUpdate(comment.id, editContent)
      setIsEditing(false)
    } else {
      setError(result.error || 'Failed to update comment')
    }

    setIsSaving(false)
  }

  const handleCancelEdit = () => {
    setEditContent(comment.content)
    setIsEditing(false)
    setError(null)
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  })

  const wasEdited = comment.edited_at && comment.edited_at !== comment.created_at

  return (
    <div className="rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface/80">
      {/* Author Info */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {comment.author.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.display_name}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
              <User className="h-5 w-5" />
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">
              {comment.author.display_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {timeAgo}
              {wasEdited && ' (edited)'}
            </p>
          </div>
        </div>

        {/* Actions (only for owner) */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Edit comment"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
              aria-label="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
            maxLength={5000}
            disabled={isSaving}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {editContent.length} / 5000 characters
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 rounded-md bg-danger/10 p-2 text-sm text-danger">
          {error}
        </div>
      )}
    </div>
  )
}
