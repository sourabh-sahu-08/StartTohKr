---
name: Frontend Implementation
description: Implement and architect React/Next.js frontend components with performance, accessibility, and maintainability. Activate when building new components, pages, or refactoring existing frontend code.
---

# Frontend Implementation

## Tech Stack Context

This project uses:
- **Next.js 16** (App Router, Turbopack)
- **React 19** with Server Components by default
- **TypeScript** (strict)
- **Tailwind CSS v4** (PostCSS plugin, `@theme` inline config)
- **shadcn/ui** (base-nova style, `@/components/ui/`)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Prisma** (PostgreSQL ORM)
- **NextAuth.js** (role-based auth)

## Architecture Principles

### Component Organization
```
src/
├── app/                    # Pages and API routes (App Router)
│   ├── (auth)/             # Auth route group (login, signup, onboarding)
│   ├── (platform)/         # Platform route group (feed, challenges, pilots, etc.)
│   ├── dashboard/          # Role-based dashboards
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui primitives (do NOT modify directly)
│   └── [feature].tsx       # Application-level components
├── lib/                    # Utilities, auth config, helpers
└── types/                  # TypeScript type definitions
```

### Server vs Client Components
- **Default to Server Components** — only add `"use client"` when the component needs:
  - Event handlers (onClick, onChange, etc.)
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document, etc.)
  - Framer Motion animations
- **Push `"use client"` as deep as possible** — wrap only the interactive part, not the entire page
- **Never import server-only code in client components**

### Component Patterns
- Extract reusable pieces into `src/components/` — not inline in page files
- Use composition over configuration — prefer children/slots over complex prop APIs
- Co-locate styles with components using Tailwind classes
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer controlled components for forms (react-hook-form + zod)

### Data Fetching
- Use async Server Components for data fetching when possible
- API routes in `src/app/api/` for mutations and external integrations
- The project has a mock-fallback mode when `DATABASE_URL` contains `USER:PASSWORD@HOST`
- Always handle loading, error, and empty states

### Performance Guidelines
- Lazy-load heavy components with `next/dynamic`
- Use `next/image` for all images (automatic optimization)
- Keep client-side JavaScript bundles small
- Avoid importing entire icon sets — import individual icons
- Use CSS transitions for simple animations, Framer Motion for complex ones
- Debounce search inputs and resize handlers

### File Naming Conventions
- Page files: `page.tsx`
- Layout files: `layout.tsx`
- Components: `kebab-case.tsx` (e.g., `startup-card.tsx`)
- Types: `kebab-case.ts` in `src/types/`
- Utilities: `kebab-case.ts` in `src/lib/`

### Error Handling
- Use `error.tsx` boundaries for route-level errors
- Provide meaningful error messages, not generic "Something went wrong"
- Always handle null/undefined data gracefully
- Use `loading.tsx` for route-level loading states

### Adding shadcn/ui Components
When a new UI primitive is needed:
```bash
npx shadcn@latest add [component-name]
```
Do not manually create files in `src/components/ui/` that shadow shadcn components.

### Tailwind CSS v4 Specifics
- Design tokens are defined with `@theme inline` in `globals.css`
- CSS custom properties use oklch color space
- Use `@custom-variant` for dark mode variant
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Use the existing color tokens (`--primary`, `--muted`, `--accent`, etc.)
- Do not create ad-hoc colors in component files
