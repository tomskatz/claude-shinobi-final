import { BlogPost } from './types'

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    blogPostSlug: 'getting-started-with-nextjs',
    blogTitle: 'Getting Started with Next.js 15',
    createdAt: '2024-01-15T10:00:00.000Z',
    createdBy: {
      name: 'Sarah Johnson'
    },
    blogPostContent: {
      html: `
        <h2>Introduction to Next.js 15</h2>
        <p>Next.js 15 brings exciting new features and improvements to the React framework. In this post, we'll explore the key changes and how to get started with your first Next.js application.</p>

        <h3>What's New in Next.js 15?</h3>
        <ul>
          <li><strong>React Server Components</strong> - Enhanced support for server-side rendering</li>
          <li><strong>Turbopack</strong> - Faster development experience with the new bundler</li>
          <li><strong>App Router improvements</strong> - More intuitive routing and layouts</li>
          <li><strong>Better TypeScript support</strong> - Enhanced type safety out of the box</li>
        </ul>

        <h3>Getting Started</h3>
        <p>To create a new Next.js 15 project, run:</p>
        <pre><code>npx create-next-app@latest my-app</code></pre>

        <p>This will set up a new project with all the latest features and best practices.</p>

        <h3>Key Features</h3>
        <p>Next.js provides several powerful features that make it an excellent choice for modern web development:</p>
        <ul>
          <li>Server-side rendering (SSR)</li>
          <li>Static site generation (SSG)</li>
          <li>API routes</li>
          <li>File-based routing</li>
          <li>Built-in CSS support</li>
        </ul>

        <h3>Conclusion</h3>
        <p>Next.js 15 continues to push the boundaries of what's possible with React applications. Whether you're building a simple blog or a complex web application, Next.js provides the tools you need to succeed.</p>
      `
    }
  },
  {
    id: '2',
    blogPostSlug: 'mastering-tailwind-css',
    blogTitle: 'Mastering Tailwind CSS 4: A Complete Guide',
    createdAt: '2024-01-10T14:30:00.000Z',
    createdBy: {
      name: 'Michael Chen'
    },
    blogPostContent: {
      html: `
        <h2>Why Tailwind CSS?</h2>
        <p>Tailwind CSS has revolutionized the way we write CSS. Instead of writing custom CSS classes, we use utility classes directly in our HTML to build beautiful, responsive designs quickly.</p>

        <h3>The New @import Syntax</h3>
        <p>Tailwind CSS 4 introduces a simplified import syntax that makes setup even easier:</p>
        <pre><code>@import "tailwindcss";</code></pre>

        <h3>Core Concepts</h3>
        <p>Understanding these concepts will help you master Tailwind:</p>
        <ul>
          <li><strong>Utility-first</strong> - Build designs using utility classes</li>
          <li><strong>Responsive design</strong> - Mobile-first breakpoint system</li>
          <li><strong>Dark mode</strong> - Built-in dark mode support</li>
          <li><strong>Custom themes</strong> - Extend with your own design system</li>
        </ul>

        <h3>Best Practices</h3>
        <ol>
          <li>Use the @apply directive sparingly for repeated patterns</li>
          <li>Leverage the JIT (Just-In-Time) compiler for better performance</li>
          <li>Create custom color palettes using CSS variables</li>
          <li>Use arbitrary values when you need precise control</li>
        </ol>

        <blockquote>
          <p>"Tailwind CSS allows you to build modern websites without ever leaving your HTML."</p>
        </blockquote>

        <h3>Advanced Techniques</h3>
        <p>Once you're comfortable with the basics, explore these advanced features:</p>
        <ul>
          <li>Custom plugins for extended functionality</li>
          <li>Component extraction strategies</li>
          <li>Animation and transition utilities</li>
          <li>Grid and flexbox layouts</li>
        </ul>
      `
    }
  },
  {
    id: '3',
    blogPostSlug: 'react-19-features',
    blogTitle: 'Exploring React 19: What You Need to Know',
    createdAt: '2024-01-05T09:15:00.000Z',
    createdBy: {
      name: 'Emily Rodriguez'
    },
    blogPostContent: {
      html: `
        <h2>React 19 is Here!</h2>
        <p>The latest version of React brings significant improvements to performance, developer experience, and new features that will change how we build applications.</p>

        <h3>Major Features</h3>
        <ul>
          <li><strong>Automatic batching</strong> - Better performance by default</li>
          <li><strong>Transitions</strong> - Mark updates as non-urgent</li>
          <li><strong>Suspense improvements</strong> - Better loading states</li>
          <li><strong>Server Components</strong> - Zero-bundle-size React components</li>
        </ul>

        <h3>The Transition API</h3>
        <p>One of the most exciting features is the new transition API that allows you to mark certain updates as transitions:</p>
        <pre><code>const [isPending, startTransition] = useTransition();

startTransition(() => {
  setSearchQuery(input);
});</code></pre>

        <h3>Performance Improvements</h3>
        <p>React 19 includes several under-the-hood improvements that make your apps faster without any code changes:</p>
        <ul>
          <li>Faster reconciliation algorithm</li>
          <li>Improved memory usage</li>
          <li>Better hydration performance</li>
          <li>Smaller bundle sizes</li>
        </ul>

        <h3>Migration Guide</h3>
        <p>Upgrading to React 19 is straightforward for most applications. Here are the key steps:</p>
        <ol>
          <li>Update React and ReactDOM to version 19</li>
          <li>Review the breaking changes documentation</li>
          <li>Test your application thoroughly</li>
          <li>Update any third-party libraries as needed</li>
        </ol>

        <h3>Looking Forward</h3>
        <p>React continues to evolve and improve. With features like Server Components and the transition API, we're seeing a shift towards more sophisticated state management and rendering patterns.</p>
      `
    }
  },
  {
    id: '4',
    blogPostSlug: 'typescript-best-practices',
    blogTitle: 'TypeScript Best Practices for 2024',
    createdAt: '2023-12-28T16:45:00.000Z',
    createdBy: {
      name: 'David Kim'
    },
    blogPostContent: {
      html: `
        <h2>Writing Better TypeScript</h2>
        <p>TypeScript has become the de facto standard for large-scale JavaScript applications. Let's explore the best practices that will help you write more maintainable and type-safe code.</p>

        <h3>Use Strict Mode</h3>
        <p>Always enable strict mode in your <code>tsconfig.json</code>:</p>
        <pre><code>{
  "compilerOptions": {
    "strict": true
  }
}</code></pre>

        <h3>Type vs Interface</h3>
        <p>Know when to use types vs interfaces:</p>
        <ul>
          <li><strong>Interfaces</strong> - Use for object shapes that might be extended</li>
          <li><strong>Types</strong> - Use for unions, intersections, and primitives</li>
        </ul>

        <h3>Avoid Any</h3>
        <p>The <code>any</code> type defeats the purpose of TypeScript. Instead:</p>
        <ul>
          <li>Use <code>unknown</code> for truly unknown types</li>
          <li>Use proper type annotations</li>
          <li>Create generic types when needed</li>
          <li>Use type guards for runtime checks</li>
        </ul>

        <h3>Leverage Utility Types</h3>
        <p>TypeScript provides many built-in utility types:</p>
        <pre><code>Partial&lt;T&gt;
Required&lt;T&gt;
Readonly&lt;T&gt;
Pick&lt;T, K&gt;
Omit&lt;T, K&gt;
Record&lt;K, T&gt;</code></pre>

        <h3>Advanced Patterns</h3>
        <ul>
          <li>Discriminated unions for type-safe state machines</li>
          <li>Conditional types for complex type logic</li>
          <li>Template literal types for string manipulation</li>
          <li>Mapped types for transforming types</li>
        </ul>

        <h3>Testing TypeScript</h3>
        <p>Don't forget to test your types! Use tools like <code>tsd</code> to write type-level tests and ensure your types work as expected.</p>
      `
    }
  }
]
