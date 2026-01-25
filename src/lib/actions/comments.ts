'use server'

import { createClient } from '@/lib/supabase/server'
import { sanitizeComment } from '@/lib/sanitize'
import {
  createCommentSchema,
  updateCommentSchema,
  deleteCommentSchema,
} from '@/lib/utils/validation'
import type { ActionResponse, CommentWithAuthor } from '@/lib/types/comments'
import { revalidatePath } from 'next/cache'

// Rate limiting map: userId -> array of timestamps
const rateLimitMap = new Map<string, number[]>()

// Rate limit: 5 comments per 15 minutes
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes in ms

/**
 * Check if user has exceeded rate limit
 */
function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userTimestamps = rateLimitMap.get(userId) || []

  // Remove old timestamps outside the window
  const recentTimestamps = userTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  )

  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false // Rate limit exceeded
  }

  // Add current timestamp
  recentTimestamps.push(now)
  rateLimitMap.set(userId, recentTimestamps)

  return true // Within rate limit
}

/**
 * Get comments for a blog post
 * Returns approved comments with author information
 */
export async function getComments(
  postSlug: string
): Promise<ActionResponse<CommentWithAuthor[]>> {
  try {
    const supabase = await createClient()

    const { data: comments, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        author:profiles!comments_user_id_fkey(*)
      `
      )
      .eq('post_slug', postSlug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Get comments error:', error)
      return { success: false, error: 'Failed to fetch comments' }
    }

    return { success: true, data: comments as CommentWithAuthor[] }
  } catch (error) {
    console.error('Get comments error:', error)
    return { success: false, error: 'Failed to fetch comments' }
  }
}

/**
 * Create a new comment
 */
export async function createComment(
  postSlug: string,
  content: string
): Promise<ActionResponse<CommentWithAuthor>> {
  try {
    // Validate input
    const validation = createCommentSchema.safeParse({ postSlug, content })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      }
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be signed in to comment' }
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return {
        success: false,
        error: `Rate limit exceeded. Maximum ${RATE_LIMIT_MAX} comments per 15 minutes.`,
      }
    }

    // Sanitize content
    const sanitizedContent = sanitizeComment(content)

    // Create comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_slug: postSlug,
        user_id: user.id,
        content: sanitizedContent,
        status: 'approved', // Auto-approve
      })
      .select(
        `
        *,
        author:profiles!comments_user_id_fkey(*)
      `
      )
      .single()

    if (error) {
      console.error('Create comment error:', error)
      return { success: false, error: 'Failed to create comment' }
    }

    // Revalidate the blog post page
    revalidatePath(`/blog/${postSlug}`)

    return { success: true, data: comment as CommentWithAuthor }
  } catch (error) {
    console.error('Create comment error:', error)
    return { success: false, error: 'Failed to create comment' }
  }
}

/**
 * Update a comment (user can only update their own)
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<ActionResponse> {
  try {
    // Validate input
    const validation = updateCommentSchema.safeParse({ commentId, content })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      }
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be signed in to edit comments' }
    }

    // Verify ownership
    const { data: existingComment } = await supabase
      .from('comments')
      .select('user_id, post_slug')
      .eq('id', commentId)
      .single()

    if (!existingComment) {
      return { success: false, error: 'Comment not found' }
    }

    if (existingComment.user_id !== user.id) {
      return { success: false, error: 'You can only edit your own comments' }
    }

    // Sanitize content
    const sanitizedContent = sanitizeComment(content)

    // Update comment
    const { error } = await supabase
      .from('comments')
      .update({
        content: sanitizedContent,
        edited_at: new Date().toISOString(),
      })
      .eq('id', commentId)

    if (error) {
      console.error('Update comment error:', error)
      return { success: false, error: 'Failed to update comment' }
    }

    // Revalidate the blog post page
    revalidatePath(`/blog/${existingComment.post_slug}`)

    return { success: true }
  } catch (error) {
    console.error('Update comment error:', error)
    return { success: false, error: 'Failed to update comment' }
  }
}

/**
 * Delete a comment (user can only delete their own)
 */
export async function deleteComment(commentId: string): Promise<ActionResponse> {
  try {
    // Validate input
    const validation = deleteCommentSchema.safeParse({ commentId })
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      }
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'You must be signed in to delete comments' }
    }

    // Verify ownership
    const { data: existingComment } = await supabase
      .from('comments')
      .select('user_id, post_slug')
      .eq('id', commentId)
      .single()

    if (!existingComment) {
      return { success: false, error: 'Comment not found' }
    }

    if (existingComment.user_id !== user.id) {
      return { success: false, error: 'You can only delete your own comments' }
    }

    // Delete comment
    const { error } = await supabase.from('comments').delete().eq('id', commentId)

    if (error) {
      console.error('Delete comment error:', error)
      return { success: false, error: 'Failed to delete comment' }
    }

    // Revalidate the blog post page
    revalidatePath(`/blog/${existingComment.post_slug}`)

    return { success: true }
  } catch (error) {
    console.error('Delete comment error:', error)
    return { success: false, error: 'Failed to delete comment' }
  }
}
