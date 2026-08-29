# StartTohKr Design System

## Brand Personality

| Trait | Expression |
|-------|-----------|
| Intelligent | Precision typography, data-forward layouts, monospace accents |
| Bold | Strong display type, decisive CTAs, high-contrast sections |
| Trustworthy | Clean structure, institutional stability, verified badges |
| Dynamic | Motion on interaction, scroll-triggered reveals, live data |
| Human | Warm copy, approachable onboarding, accessible design |
| Institutional but Modern | Government-grade credibility with startup-grade UX |

---

## Colors

### Foundation Palette (oklch)

The project uses oklch color space for perceptual uniformity. All tokens are defined in `src/app/globals.css`.

#### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` | Page background — pure white |
| `--foreground` | `oklch(0.145 0 0)` | Primary text — near black |
| `--primary` | `oklch(0.205 0 0)` | CTAs, primary actions — near black |
| `--primary-foreground` | `oklch(0.985 0 0)` | Text on primary — near white |
| `--muted` | `oklch(0.97 0 0)` | Subtle backgrounds — warm gray |
| `--muted-foreground` | `oklch(0.556 0 0)` | Secondary text — mid gray |
| `--border` | `oklch(0.922 0 0)` | Dividers, card borders — light gray |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error states — red |

#### Dark Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` | Page background — near black |
| `--foreground` | `oklch(0.985 0 0)` | Primary text — near white |
| `--primary` | `oklch(0.922 0 0)` | CTAs, primary actions — light gray |
| `--primary-foreground` | `oklch(0.205 0 0)` | Text on primary — near black |
| `--muted` | `oklch(0.269 0 0)` | Subtle backgrounds — dark gray |
| `--muted-foreground` | `oklch(0.708 0 0)` | Secondary text — mid gray |
| `--border` | `oklch(1 0 0 / 10%)` | Dividers — white at 10% |

### Color Usage Rules
- The palette is intentionally neutral. StartTohKr's identity comes from **typography and composition**, not color.
- Accent colors should be introduced sparingly for specific semantic purposes (success, warning, status indicators).
- Never use raw hex/rgb colors inline — always reference design tokens.
- When adding a new semantic color, add it as a CSS custom property in `globals.css`, not as a Tailwind arbitrary value.

---

## Typography

### Font Stack

| Role | Font | Variable | Usage |
|------|------|----------|-------|
| Display & Body | Geist Sans | `--font-geist-sans` | Headlines, body text, UI labels |
| Monospace | Geist Mono | `--font-geist-mono` | Code, data, technical content, scores |

### Type Scale

| Level | Size | Weight | Letter-spacing | Usage |
|-------|------|--------|----------------|-------|
| Display XL | `text-6xl` / `text-7xl` | 800 (extrabold) | `-0.02em` (tight) | Hero headlines only |
| Display | `text-4xl` / `text-5xl` | 700 (bold) | `-0.01em` | Section headlines |
| Heading | `text-2xl` / `text-3xl` | 600 (semibold) | Normal | Card titles, subsections |
| Subheading | `text-lg` / `text-xl` | 500 (medium) | Normal | Feature labels |
| Body | `text-base` (16px) | 400 (normal) | Normal | Paragraphs, descriptions |
| Caption | `text-sm` | 400 (normal) | Normal | Meta info, timestamps |
| Label | `text-xs` | 500 (medium) | `0.05em` (wide) | Badges, status labels, all-caps |
| Data | `text-base` / `text-lg` mono | 500 (medium) | Normal | Statistics, scores, KPIs |

### Typography Rules
- Maximum 3 font weights per page
- Body line-height: 1.6–1.7
- Display line-height: 1.1–1.2
- Maximum line length: 65ch for body text
- Never use decorative or script fonts
- Use Geist Mono for numbers, scores, data values, and technical strings

---

## Spacing

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | `4px` | Icon-to-label gaps |
| `space-sm` | `8px` | Tight component spacing |
| `space-md` | `16px` | Default component spacing |
| `space-lg` | `24px` | Section internal padding |
| `space-xl` | `32px` | Between major elements |
| `space-2xl` | `48px` | Section padding |
| `space-3xl` | `64px` | Between page sections |
| `space-4xl` | `96px` | Hero/CTA vertical padding |

### Spacing Rules
- Use consistent vertical rhythm — don't mix arbitrary pixel values
- Sections should breathe — `py-24` minimum for major sections
- Cards should have generous internal padding (`p-6` minimum)
- Dense information (dashboards, tables) can use tighter spacing

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | `0.625rem` (10px) | Base radius |
| `radius-sm` | `6px` | Badges, small elements |
| `radius-md` | `8px` | Inputs, buttons |
| `radius-lg` | `10px` | Cards |
| `radius-xl` | `14px` | Modals, large containers |
| `radius-2xl` | `18px` | Feature cards, hero elements |

---

## Motion

### Timing

| Speed | Duration | Easing | Usage |
|-------|----------|--------|-------|
| Instant | `0ms` | — | Focus outlines, color changes |
| Fast | `150ms` | `ease-out` | Hover states, toggles |
| Normal | `300ms` | `ease-in-out` | Component transitions, reveals |
| Slow | `500ms` | `spring(1, 80, 10)` | Page-level entrances, hero animations |
| Deliberate | `800ms` | `spring(1, 60, 12)` | Staggered list reveals, large layout shifts |

### Framer Motion Presets

```tsx
// Fade up entrance
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Staggered children
const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Scale on hover
const hoverScale = {
  whileHover: { scale: 1.02 },
  transition: { type: "spring", stiffness: 300 }
};
```

### Motion Rules
- Every entrance animation should be `opacity + translateY` (fade up)
- Stagger lists/grids with 80–120ms delay per item
- Use `spring` physics for interactive elements, `ease` for passive transitions
- Always include `prefers-reduced-motion` fallbacks
- Never animate `width`, `height`, or `top`/`left` — use `transform` and `opacity`

---

## Effects

| Effect | Usage | Constraint |
|--------|-------|-----------|
| Backdrop blur | Navigation bar, modals, overlays | `backdrop-blur-sm` to `backdrop-blur-md` only |
| Box shadow | Elevated cards, dropdowns | Use sparingly — `shadow-sm` default |
| Gradient | Hero accents, CTA backgrounds | Subtle radial gradients only, never full-page |
| Border | Structure, separation | Fine 1px borders using `--border` token |
| Opacity | Layering, disabled states | Use for hover overlays and de-emphasis |

---

## Existing Component Inventory

### shadcn/ui primitives (`src/components/ui/`)
- `avatar.tsx` — User avatars
- `badge.tsx` — Status labels, tags
- `button.tsx` — Primary actions (variants: default, secondary, ghost, outline, destructive)
- `card.tsx` — Content containers
- `dialog.tsx` — Modal dialogs
- `dropdown-menu.tsx` — Context menus, action menus
- `input.tsx` — Text inputs
- `label.tsx` — Form labels
- `progress.tsx` — Progress bars
- `scroll-area.tsx` — Scrollable containers
- `select.tsx` — Dropdown selects
- `separator.tsx` — Visual dividers
- `sheet.tsx` — Side panels, mobile menus
- `sonner.tsx` — Toast notifications
- `tabs.tsx` — Tabbed content
- `textarea.tsx` — Multi-line text inputs

### Application components (`src/components/`)
- `ai-copilot.tsx` — Global AI assistant overlay
- `providers.tsx` — Context providers wrapper

### Adding New Components
1. For UI primitives: `npx shadcn@latest add [name]`
2. For application components: create in `src/components/[name].tsx`
3. For page-specific components: co-locate in the page's route directory
4. Always check if an existing component can be extended first

---

## Page Layout Patterns

### Landing Page
- Full-width hero with radial gradient accent
- Constrained content sections (`max-w-5xl mx-auto`)
- Alternating section backgrounds for visual rhythm
- Strong CTA section before footer

### Platform Pages (authenticated)
- Sidebar navigation (defined in `(platform)/layout.tsx`)
- Content area with contextual header
- Card-based content layouts
- Tabbed subsections for complex views

### Dashboard Pages (role-based)
- Sidebar navigation (defined in `dashboard/layout.tsx`)
- Role-specific metric cards
- Activity feed / recent items
- Quick action buttons

---

## Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| Default | <640px | Mobile phones |
| `sm:` | 640px+ | Large phones |
| `md:` | 768px+ | Tablets |
| `lg:` | 1024px+ | Small desktops |
| `xl:` | 1280px+ | Standard desktops |
| `2xl:` | 1536px+ | Large displays |

---

## File Reference

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Design tokens, theme config, base styles |
| `src/app/layout.tsx` | Root layout, font loading, providers |
| `components.json` | shadcn/ui configuration |
| `postcss.config.mjs` | PostCSS + Tailwind CSS v4 setup |
| `DESIGN_SYSTEM.md` | This file — the design system reference |
| `PROJECT_BRIEF.md` | Product specification and feature requirements |
