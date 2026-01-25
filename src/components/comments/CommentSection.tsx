import { getComments } from '@/lib/actions/comments'
import { CommentListWrapper } from './CommentListWrapper'
import { MessageCircle } from 'lucide-react'

interface CommentSectionProps {
  postSlug: string
}

/**
 * Server Component: Entry point for comment section
 * Fetches initial comments on the server and passes to client wrapper
 */
export async function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: initialComments = [], error } = await getComments(postSlug)

  if (error) {
    console.error('Failed to load comments:', error)
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">
          Comments ({initialComments.length})
        </h2>
      </div>
      <CommentListWrapper postSlug={postSlug} initialComments={initialComments} />
    </section>
  )
}
