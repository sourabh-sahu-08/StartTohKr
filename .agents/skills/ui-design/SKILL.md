---
name: Premium UI Design
description: Design and implement premium, non-generic frontend interfaces with strong visual identity, typography, motion, and interaction design. Activate when working on UI components, pages, layouts, styling, or visual design tasks.
---

# Premium UI Design

## Core Philosophy

Never produce generic AI-generated SaaS UI.

Avoid:
- Purple/blue gradient backgrounds
- Generic rounded cards everywhere
- Excessive glassmorphism
- Huge centered hero + 2 buttons + 4 statistics
- Generic Lucide/icon-library decoration
- Random gradients
- Excessive pills
- Repetitive feature cards
- Stock illustrations
- "AI startup" visual clichés
- Cookie-cutter dashboard layouts
- Identical card grids with icon + heading + paragraph

## Design Goals

Every page should feel:
- **Intentional** — every element has a reason to exist
- **Editorial** — crafted like a magazine layout, not a template
- **Premium** — quality visible in the details
- **Modern** — aware of current design trends without chasing them
- **Distinctive** — recognizably StartTohKr, not generic SaaS
- **Visually coherent** — unified across all pages and states

Prioritize in this order:
1. Typography
2. Composition & Layout
3. Spacing & Whitespace
4. Visual hierarchy
5. Motion & Interaction
6. Color
7. Decorative details

## Pre-Implementation Checklist

Do not start implementation immediately.

First inspect:
- Existing components in `src/components/ui/` and `src/components/`
- Existing design tokens in `src/app/globals.css`
- Font configuration in `src/app/layout.tsx`
- Current page structure and routing
- Assets in `public/`
- Animation patterns already in use
- Responsive behavior of existing pages
- `DESIGN_SYSTEM.md` in the project root

Before creating a new component, determine whether an existing component can be extended.

Before adding a new dependency, check if the existing stack (framer-motion, shadcn/ui, Tailwind CSS v4) can achieve the same result.

## Typography

Use typography as a **major visual element**, not just a content delivery mechanism.

Prefer:
- Strong display typography with deliberate size jumps
- Carefully controlled line lengths (max 65ch for body text)
- Intentional font pairing (Geist Sans for display, Geist Mono for data/technical)
- High contrast between headings and supporting text
- Varied font weights used sparingly (not every heading needs to be bold)
- Letter-spacing adjustments on display type (tight for large, normal for body)

Do not:
- Use more than 3 font weights on a single page
- Set body text smaller than 16px
- Use all-caps for more than labels/badges
- Apply decorative fonts to body text

## Layout & Composition

Avoid making every section symmetrical.

Use:
- Asymmetric layouts where content and visual weight balance differently
- Large, generous whitespace as a design element
- Overlapping elements (z-index layering, negative margins)
- Editorial compositions — mix full-bleed, constrained, and offset sections
- Varied section heights — not every section needs to be the same size
- Clear visual focal points — guide the eye
- CSS Grid for complex layouts, Flexbox for alignment

Do not:
- Center everything
- Make every section a max-width container with centered text
- Use the same padding on every section
- Stack 3 identical cards in a row as the primary layout pattern

## Color

The project uses a neutral (oklch-based) palette with light and dark modes.

Guidelines:
- Use the black/white foundation as the primary visual language
- Accent colors should be rare and meaningful — they highlight, not decorate
- Never use color as the only way to convey information
- Dark mode is not an inverted light mode — it should feel intentionally designed
- Avoid pure saturated colors from icon libraries; prefer muted, curated tones
- Use opacity and transparency for layering, not multiple similar grays

## Motion & Animation

Motion should communicate hierarchy and state, not decorate.

Use:
- Entrance animations (fade + translate) for content appearing on scroll
- Scroll-triggered reveals using Intersection Observer or framer-motion `whileInView`
- Subtle parallax for depth (sparingly)
- Hover transformations that communicate interactivity
- Smooth state transitions (loading, empty, populated, error)
- Staggered children animations for lists/grids
- Spring physics over linear easing

Avoid:
- Excessive bouncing
- Random floating/pulsing animations
- Animations that delay user interaction
- Animation durations > 600ms for UI transitions
- Animations that trigger on every re-render

Always respect `prefers-reduced-motion`.

## Icons

Do not automatically reach for generic icon-library icons.

If an icon is required:
- Prefer custom SVG when the icon is a brand element
- Use Lucide icons only for standard UI patterns (close, menu, arrow, etc.)
- Keep stroke widths consistent across all icons
- Icons should never be the primary visual element of a section
- Size icons appropriately — not every icon needs to be 24×24

## Responsive Design

Design desktop and mobile **intentionally** as separate experiences.

Do not simply stack desktop elements vertically.

- Mobile should have its own hierarchy and layout decisions
- Touch targets must be at least 44×44px
- Navigation should be genuinely usable on mobile, not just collapsed
- Images and media should be sized appropriately per breakpoint
- Test at 320px, 768px, and 1280px minimum

## Before Finishing — Self-Review Checklist

Ask yourself:
- Does this look like a generic AI-generated website?
- Could this design belong to any random SaaS startup?
- Is there a recognizable visual identity?
- Is the hierarchy obvious within 2 seconds?
- Are there too many cards?
- Are animations meaningful or decorative?
- Does the page have a clear visual focal point?
- Would a designer be embarrassed by any section?
- Is there enough whitespace?
- Does every element earn its place?

If the answer to any red-flag question is yes, **improve the design before declaring done**.
