# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shinobi is a blog application built with Next.js 15, React 19, and Tailwind CSS 4. It serves as a starter project for learning Claude Code and demonstrates modern web development practices. The blog content can be managed via Hygraph (formerly GraphCMS) using GraphQL, or can use mock data for testing and development without a CMS connection.

## Tech Stack

**Core Frameworks:**

- Next.js 15 with App Router (React Server Components)
- React 19
- TypeScript 5

**Styling:**

- Tailwind CSS 4 (using new `@import "tailwindcss"` syntax)
- Custom CSS variables for theming
- Lucide React for icons

**Data & Security:**

- GraphQL for CMS data fetching (optional)
- Mock data support for testing without CMS
- DOMPurify + JSDOM for HTML sanitization
- Hygraph (GraphCMS) as headless CMS (optional)

**Testing:**

- Vitest as test runner
- React Testing Library for component testing
- jsdom for DOM simulation

**Build Tools:**

- Turbopack (Next.js development mode)
- TypeScript compiler

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with header and dark mode toggle
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles and theme variables
│   ├── blog/
│   │   ├── page.tsx         # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx     # Individual blog post page (dynamic route)
│   └── preview/
│       └── page.tsx         # Component preview page
│
├── components/              # React components
│   ├── DarkModeToggle.tsx  # Client component for theme switching
│   ├── BlogSidebar.tsx     # Sidebar for blog pages
│   └── ui/                 # UI components library
│       └── Button/
│           ├── Button.tsx
│           └── Button.test.tsx
│
|── hooks/                  #reusable hooks
├── lib/                     # Utilities and shared code
│   ├── queries.ts          # GraphQL query definitions
│   ├── mockData.ts         # Mock blog posts for testing without CMS
│   ├── sanitize.ts         # HTML sanitization utility
│   └── types.ts            # TypeScript type definitions
│
└── test/                    # Test configuration
    ├── setup.ts            # Vitest setup file
    └── vitest.d.ts         # Vitest type definitions
```

## Requirements

- **Node.js**: Version 20.0.0 or higher (recommended: 20.19.6+)
  - Next.js 15 requires at least Node 18.18.0, but Node 20+ is recommended
  - Use `node --version` to check your current version

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests with Vitest
npm test

# Run tests with UI
npm test:ui
```

## Architecture

### Data Flow

**Current Setup (Mock Data):**

- Blog posts are loaded from `src/lib/mockData.ts` for testing without a CMS connection
- Mock data includes 4 sample blog posts with realistic content
- Perfect for development and testing without external dependencies

**Optional Hygraph Integration:**

- Blog posts can be fetched from Hygraph CMS via GraphQL queries (see `src/lib/queries.ts`)
- All data fetching happens server-side in Next.js Server Components using the `fetch` API
- Content is cached with ISR (Incremental Static Regeneration) using `next: { revalidate: 3600 }` (1 hour)
- HTML content from Hygraph is sanitized using DOMPurify before rendering (see `src/lib/sanitize.ts`)
- To switch to Hygraph, update `src/app/blog/page.tsx` and `src/app/blog/[slug]/page.tsx` to use GraphQL queries instead of mock data

### Key Patterns

**Environment Variables:**

- `HYGRAPH_ENDPOINT` - Optional. Only required if switching from mock data to Hygraph CMS integration. Must be set in `.env.local` or deployment environment if using Hygraph.

**GraphQL Integration:**

- Queries defined in `src/lib/queries.ts` as raw GraphQL strings
- `GET_BLOG_POSTS` - Fetches all blog posts for listing page
- `GET_SINGLE_POST` - Fetches individual post by slug
- Error handling checks both HTTP response status and GraphQL errors in the response

**HTML Sanitization:**

- Blog content HTML is sanitized in `src/lib/sanitize.ts` before rendering
- Uses DOMPurify with JSDOM window instance
- Allows specific tags (p, strong, em, h1-h6, ul, ol, li, a, img, blockquote, code, pre, etc.)
- Allows specific attributes (href, src, alt, title, target, class, id)
- Explicitly disallows data attributes and unknown protocols for security

**Routing:**

- `/` - Home page with hero and navigation
- `/blog` - Blog listing page with all posts
- `/blog/[slug]` - Individual blog post page
- `/preview` - Component preview page

### Styling System

The app uses a custom CSS variables-based theming system with dark mode support:

- CSS variables defined in `src/app/globals.css` for both light and dark themes
- Dark mode toggled by adding/removing `.dark` class on `<html>` element
- Color palette: `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--success`, `--warning`, `--danger`, `--info`, `--surface`, `--border`
- Typography: Rubik (primary font), Merriweather (heading font)
- Tailwind CSS 4 with custom theme integration via `@theme` directive

### Testing

- Uses Vitest with React Testing Library
- Test setup in `src/test/setup.ts` extends expect with jest-dom matchers
- JSDOM environment for component testing
- Path aliases from tsconfig automatically resolved via `vite-tsconfig-paths`

### Type Safety

- TypeScript with strict mode
- Blog post types defined in `src/lib/types.ts`
- Path aliases configured in `tsconfig.json` (`@/*` maps to `src/*`)

## Code Conventions

- Server Components by default; use `"use client"` directive only when needed (e.g., for hooks, event handlers)
- Async/await for data fetching in Server Components
- Error boundaries via Next.js error handling and `notFound()` function
- Component files use PascalCase, utility files use camelCase
- When creating a new page component, always add a link to that page in the header (`src/app/layout.tsx`)
