import { sanitizeHTML } from '@/lib/sanitize'
import { BlogPost } from '@/lib/types'
import { mockBlogPosts } from '@/lib/mockData'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './BlogPost.module.css'
import Avatar from '@/components/ui/Avatar/Avatar'
// import { CommentSection } from '@/components/comments/CommentSection' // Disabled until Supabase is configured

async function getSinglePost(slug: string): Promise<BlogPost | null> {
  // Using mock data for testing without CMS
  const post = mockBlogPosts.find(p => p.blogPostSlug === slug)
  return post || null
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const post = await getSinglePost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {post.blogTitle}
          </h1>
          <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-400">
            <Avatar name={post.createdBy.name} size="md" />
            <div>
              <div>By {post.createdBy.name}</div>
              <div>{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </header>
        
        <div
          className={styles.blogContent}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.blogPostContent.html) }}
        />
      </article>

      {/* Comment Section - Disabled until Supabase is configured
          Follow COMMENT_SYSTEM_SETUP.md to enable comments */}
      {/* <CommentSection postSlug={post.blogPostSlug} /> */}

      <div className="mt-12 pt-8 border-t border-border">
        <Link 
          href="/blog" 
          className="inline-flex items-center space-x-2 px-4 py-2 bg-transparent text-muted hover:text-primary transition-colors duration-200 hover:bg-primary/5 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Blog</span>
        </Link>
      </div>
    </div>
  )
}