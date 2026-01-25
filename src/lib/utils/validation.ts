import { z } from 'zod'

/**
 * Validation schema for creating a new comment
 */
export const createCommentSchema = z.object({
  postSlug: z
    .string()
    .min(1, 'Post slug is required')
    .max(255, 'Post slug too long'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment must be 5000 characters or less')
    .refine(
      (content) => content.trim().length > 0,
      'Comment cannot be only whitespace'
    ),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>

/**
 * Validation schema for updating a comment
 */
export const updateCommentSchema = z.object({
  commentId: z.string().uuid('Invalid comment ID'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment must be 5000 characters or less')
    .refine(
      (content) => content.trim().length > 0,
      'Comment cannot be only whitespace'
    ),
})

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

/**
 * Validation schema for deleting a comment
 */
export const deleteCommentSchema = z.object({
  commentId: z.string().uuid('Invalid comment ID'),
})

export type DeleteCommentInput = z.infer<typeof deleteCommentSchema>

/**
 * Validation schema for updating comment status (admin only)
 */
export const updateCommentStatusSchema = z.object({
  commentId: z.string().uuid('Invalid comment ID'),
  status: z.enum(['approved', 'hidden'], {
    errorMap: () => ({ message: 'Status must be approved or hidden' }),
  }),
})

export type UpdateCommentStatusInput = z.infer<typeof updateCommentStatusSchema>
