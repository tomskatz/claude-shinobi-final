import type { Database } from './database.types'

/**
 * Comment row from database
 */
export type Comment = Database['public']['Tables']['comments']['Row']

/**
 * Profile row from database
 */
export type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Comment with author profile information
 * Used when displaying comments with user details
 */
export interface CommentWithAuthor extends Comment {
  author: Profile
}

/**
 * Server action response type
 */
export interface ActionResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Comment status enum
 */
export type CommentStatus = 'approved' | 'hidden'

/**
 * Real-time comment event payload
 */
export interface RealtimeCommentPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Comment | null
  old: Comment | null
}
