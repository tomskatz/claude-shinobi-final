# Comment System Setup Guide

This guide will walk you through setting up the Supabase comment system for your Shinobi blog.

## ✅ What Has Been Implemented

### Phase 1-4: Core System (COMPLETE)
- ✅ Supabase client utilities (browser & server)
- ✅ Database schema and RLS policies SQL files
- ✅ Google OAuth authentication system
- ✅ User profile management
- ✅ Comment CRUD operations with validation
- ✅ Rate limiting (5 comments per 15 minutes)
- ✅ HTML sanitization for security
- ✅ Comment UI components (Form, List, Item)
- ✅ Auth button in header
- ✅ Comments integrated into blog post pages

### Phase 5-6: Advanced Features (OPTIONAL - can be added later)
- ⏳ Real-time comment updates via Supabase Realtime
- ⏳ Admin moderation dashboard
- ⏳ Comment hide/delete for admins

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 20.0.0+ installed
- A Supabase account (free tier works)
- A Google Cloud project for OAuth

## 🚀 Setup Steps

### Step 1: Install Missing Dependencies

```bash
npm install date-fns
```

### Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `shinobi-blog` (or your choice)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### Step 3: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the content from `supabase/migrations/001_create_profiles_and_comments.sql`
4. Click **Run** to create tables
5. Create another new query
6. Copy and paste the content from `supabase/migrations/002_create_rls_policies.sql`
7. Click **Run** to create RLS policies

### Step 4: Enable Realtime (Optional - for Phase 5)

1. In Supabase dashboard, go to **Database** → **Replication**
2. Find the `comments` table
3. Toggle **Enable Realtime** to ON
4. Save changes

### Step 5: Configure Google OAuth

#### A. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: "Shinobi Blog"
   - Support email: your email
   - Add scopes: `email`, `profile`, `openid`
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: "Shinobi Blog"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

#### B. Enable Google Provider in Supabase

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and toggle it to enabled
3. Paste your **Client ID** and **Client Secret**
4. Copy the **Redirect URL** shown (should match what you entered in Google Console)
5. Click **Save**

### Step 6: Update Environment Variables

Update `.env.local` with your Supabase credentials:

```bash
# Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Your site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find these values:**
- Go to Supabase Dashboard → **Settings** → **API**
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Project API keys → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Project API keys → `service_role` `secret` → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** Never commit `.env.local` to git. The service role key should be kept secret.

### Step 7: Mark Your Account as Admin (Optional)

To access the admin moderation features (once implemented in Phase 6):

1. Sign in to your app with Google OAuth
2. In Supabase dashboard, go to **Table Editor** → **profiles**
3. Find your profile row (by email)
4. Edit the row and set `is_admin` to `true`
5. Save changes

### Step 8: Test the System

1. Start the development server:
```bash
npm run dev
```

2. Navigate to a blog post (e.g., `http://localhost:3000/blog/getting-started`)

3. Test the following:
   - Click "Sign In" → Sign in with Google
   - Verify auth button shows your name
   - Verify comment form appears
   - Post a comment
   - Edit your comment
   - Delete your comment
   - Sign out

## 🔒 Security Features Implemented

- ✅ **Input Validation**: Zod schemas validate all inputs
- ✅ **HTML Sanitization**: DOMPurify removes XSS attacks
- ✅ **Rate Limiting**: Max 5 comments per 15 minutes
- ✅ **RLS Policies**: Users can only edit/delete own comments
- ✅ **CSRF Protection**: Built into Next.js Server Actions
- ✅ **OAuth**: Secure Google authentication
- ✅ **HttpOnly Cookies**: Session tokens not accessible via JS

## 🎨 UI Features

- ✅ Character counter (5000 max)
- ✅ Edit/delete buttons for comment owners
- ✅ Inline editing with save/cancel
- ✅ Empty state ("Be the first to comment!")
- ✅ Loading skeletons
- ✅ Error messages
- ✅ Responsive design
- ✅ Dark mode compatible
- ✅ Time ago formatting (e.g., "2 hours ago")

## 📁 File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx           # Blog post with comments
│   └── layout.tsx                 # Header with auth button
│
├── components/
│   ├── auth/
│   │   └── AuthButton.tsx         # Sign in/out button
│   └── comments/
│       ├── AuthPrompt.tsx         # Sign in prompt
│       ├── CommentForm.tsx        # New comment form
│       ├── CommentItem.tsx        # Individual comment
│       ├── CommentList.tsx        # List of comments
│       ├── CommentListWrapper.tsx # Client wrapper
│       ├── CommentSection.tsx     # Server entry point
│       └── CommentSkeleton.tsx    # Loading state
│
├── hooks/
│   └── useAuth.ts                 # Auth state hook
│
├── lib/
│   ├── actions/
│   │   ├── auth.ts                # Auth actions
│   │   └── comments.ts            # Comment CRUD actions
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client
│   ├── types/
│   │   ├── comments.ts            # Comment types
│   │   └── database.types.ts      # Supabase types
│   └── utils/
│       ├── sanitize.ts            # HTML sanitization
│       └── validation.ts          # Zod schemas
│
├── middleware.ts                  # Session refresh + admin guard
└── supabase/
    └── migrations/
        ├── 001_create_profiles_and_comments.sql
        └── 002_create_rls_policies.sql
```

## 🐛 Troubleshooting

### "Sign in failed"
- Check Google OAuth credentials are correct in Supabase
- Verify redirect URL matches exactly (including https/http)
- Check browser console for specific errors

### "Failed to create comment"
- Verify you're signed in
- Check rate limit (5 per 15 min)
- Check browser console for validation errors
- Verify RLS policies were created correctly

### "Comments not loading"
- Check Supabase project is running
- Verify environment variables are set correctly
- Check browser console for API errors
- Verify database tables exist

### "Permission denied" errors
- Check RLS policies were created
- Try disabling RLS temporarily to debug
- Verify user profile was created

## 🚧 Next Steps (Optional)

### Phase 5: Real-time Updates
To enable live comment updates without page refresh:
1. Create `src/lib/hooks/useComments.ts` with Realtime subscription
2. Update `CommentListWrapper` to use the hook
3. Enable Realtime on comments table (see Step 4)

### Phase 6: Admin Moderation
To add admin dashboard:
1. Create `src/lib/actions/moderation.ts`
2. Create admin page at `src/app/admin/comments/page.tsx`
3. Create moderation components
4. Mark your account as admin (see Step 7)

### Phase 7: Enhancements
- Add toast notifications (use `sonner` or `react-hot-toast`)
- Add optimistic UI updates
- Write tests (Vitest + React Testing Library)
- Add email notifications
- Add threaded replies
- Add comment reactions

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 Success!

If you've completed Steps 1-8, your comment system is now live! Users can:
- Sign in with Google
- Post comments on blog posts
- Edit and delete their own comments
- See all comments in real-time (once Phase 5 is added)

Need help? Check the Supabase logs in Dashboard → **Logs** → **API** for debugging.
