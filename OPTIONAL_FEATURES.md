# Optional Features Implementation Guide

The core comment system (Phases 1-4) is complete and functional. This document outlines optional enhancements you can add to improve the user experience.

## Phase 5: Real-time Updates ⚡

**Why:** Comments update instantly across all browser windows without page refresh

**Implementation:**

### 1. Create useComments Hook

Create `src/lib/hooks/useComments.ts`:

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { CommentWithAuthor } from '@/lib/types/comments'

export function useComments(postSlug: string, initialComments: CommentWithAuthor[]) {
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`comments:${postSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_slug=eq.${postSlug}`,
        },
        async (payload) => {
          // Fetch the new comment with author info
          const { data } = await supabase
            .from('comments')
            .select(`*, author:profiles!comments_user_id_fkey(*)`)
            .eq('id', payload.new.id)
            .single()

          if (data && data.status === 'approved') {
            setComments((prev) => [...prev, data as CommentWithAuthor])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'comments',
          filter: `post_slug=eq.${postSlug}`,
        },
        (payload) => {
          if (payload.new.status === 'hidden') {
            // Remove hidden comments
            setComments((prev) => prev.filter((c) => c.id !== payload.new.id))
          } else {
            // Update edited comment
            setComments((prev) =>
              prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
            )
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
          filter: `post_slug=eq.${postSlug}`,
        },
        (payload) => {
          setComments((prev) => prev.filter((c) => c.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postSlug, supabase])

  return comments
}
```

### 2. Update CommentListWrapper

Update `src/components/comments/CommentListWrapper.tsx`:

```typescript
// Replace the useState line with:
const comments = useComments(postSlug, initialComments)

// Remove the handleCommentAdded, handleCommentDeleted, handleCommentUpdated handlers
// The real-time hook handles everything automatically
```

### 3. Enable Realtime in Supabase

1. Go to Supabase Dashboard → Database → Replication
2. Find `comments` table
3. Toggle "Enable Realtime"
4. Save

**Benefits:**
- New comments appear instantly for all users
- Edits and deletions sync in real-time
- Better engagement and conversation flow

---

## Phase 6: Admin Moderation 👮

**Why:** Admins can hide inappropriate comments and manage all discussions

**Implementation:**

### 1. Create Moderation Actions

Create `src/lib/actions/moderation.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function hideComment(commentId: string, postSlug: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Verify admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return { success: false, error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('comments')
    .update({ status: 'hidden' })
    .eq('id', commentId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/blog/${postSlug}`)
  return { success: true }
}

export async function showComment(commentId: string, postSlug: string) {
  // Similar to hideComment but set status to 'approved'
}

export async function getAllComments() {
  const supabase = await createClient()

  const { data: comments, error } = await supabase
    .from('comments')
    .select(`*, author:profiles!comments_user_id_fkey(*)`)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: error.message }
  return { success: true, data: comments }
}
```

### 2. Create Admin Page

Create `src/app/admin/comments/page.tsx`:

```typescript
import { getAllComments } from '@/lib/actions/moderation'
import { CommentModerationList } from '@/components/admin/CommentModerationList'

export default async function AdminCommentsPage() {
  const { data: comments = [] } = await getAllComments()

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-3xl font-bold">Comment Moderation</h1>
      <CommentModerationList comments={comments} />
    </div>
  )
}
```

### 3. Create Moderation Components

Create `src/components/admin/CommentModerationList.tsx` and `CommentModerationCard.tsx` with:
- List of all comments (approved + hidden)
- Filter by status
- Hide/Show/Delete buttons
- Link to original post

**Benefits:**
- Quick moderation of inappropriate content
- No comments are permanently deleted (can be restored)
- Admin dashboard for oversight

---

## Phase 7: Polish & Enhancements 💎

### Toast Notifications

**Library:** `sonner` (recommended)

```bash
npm install sonner
```

```typescript
import { toast } from 'sonner'

// In CommentForm after successful post:
toast.success('Comment posted successfully!')

// After failed post:
toast.error(result.error || 'Failed to post comment')
```

### Optimistic UI Updates

Update `CommentForm` to show comment immediately before server response:

```typescript
const handleSubmit = async (e) => {
  e.preventDefault()

  // Add optimistic comment
  const optimisticComment = {
    id: 'temp-' + Date.now(),
    content,
    created_at: new Date().toISOString(),
    // ... other fields
  }
  onCommentAdded(optimisticComment)

  // Submit to server
  const result = await createComment(postSlug, content)

  if (result.success) {
    // Replace optimistic with real comment
    onCommentReplaced(optimisticComment.id, result.data)
  } else {
    // Remove optimistic comment on error
    onCommentRemoved(optimisticComment.id)
  }
}
```

### Email Notifications

Use Supabase Edge Functions to send emails when:
- Someone replies to your comment
- Admin hides your comment
- Your comment gets a reaction

### Comment Reactions

Add emoji reactions (👍, ❤️, 🎉, etc.):
1. Create `comment_reactions` table
2. Add reaction buttons to `CommentItem`
3. Show reaction count
4. Highlight user's reactions

### Threaded Replies

Add nested comment support:
1. Add `parent_id` to comments table
2. Update UI to show reply tree
3. Add "Reply" button to comments
4. Indent nested comments

### Comment Search

Add search functionality:
1. Add search input above comment list
2. Filter comments by text content
3. Highlight search terms
4. Show match count

### Tests

Create tests with Vitest and React Testing Library:

```typescript
// src/lib/utils/validation.test.ts
import { describe, it, expect } from 'vitest'
import { createCommentSchema } from './validation'

describe('createCommentSchema', () => {
  it('validates correct comment', () => {
    const result = createCommentSchema.safeParse({
      postSlug: 'test-post',
      content: 'This is a test comment'
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty content', () => {
    const result = createCommentSchema.safeParse({
      postSlug: 'test-post',
      content: ''
    })
    expect(result.success).toBe(false)
  })
})
```

---

## Priority Recommendations

1. **Real-time Updates** (Phase 5) - Big UX improvement, relatively easy
2. **Toast Notifications** (Phase 7) - Better user feedback
3. **Admin Moderation** (Phase 6) - Important for community management
4. **Optimistic UI** (Phase 7) - Makes app feel faster
5. **Tests** (Phase 7) - Prevent regressions
6. **Email Notifications** - Increases engagement
7. **Reactions** - Fun engagement feature
8. **Threaded Replies** - Better conversations

## Estimated Implementation Times

- Phase 5 (Real-time): **2-3 hours**
- Phase 6 (Admin): **4-6 hours**
- Phase 7 (Polish): **varies by feature**
  - Toast notifications: 30 mins
  - Optimistic UI: 1-2 hours
  - Tests: 4-6 hours
  - Email notifications: 4-6 hours (with Edge Functions)
  - Reactions: 3-4 hours
  - Threaded replies: 8-12 hours

## Need Help?

All these features follow similar patterns to what's already implemented. Use the existing code as a reference:
- Authentication: See `src/lib/actions/auth.ts`
- Server Actions: See `src/lib/actions/comments.ts`
- Client Components: See `src/components/comments/`
- Type Safety: See `src/lib/types/`

Good luck! 🚀
