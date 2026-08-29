# StartTohKr UI Rules

## Brand

StartTohKr is an AI-powered innovation ecosystem connecting:
- Startups
- Government departments
- Investors
- Mentors
- Industry partners
- Evaluators

The interface must communicate:
- **Innovation** — forward-thinking, cutting-edge feel
- **Trust** — institutional credibility without being boring
- **Intelligence** — precision, data-awareness, AI-native
- **Movement** — progress, momentum, energy
- **Opportunity** — possibility, access, openness
- **Scale** — national ambition, not a small-team side project

## Visual Anti-Patterns

The website must NOT look like a generic AI-generated SaaS website.

**Banned patterns:**
- Generic purple/blue gradients as hero backgrounds
- Excessive glass cards with blur everywhere
- Generic dashboard layouts with 4 stat cards at the top
- 3 identical rounded cards in a row (icon + heading + paragraph)
- Generic icon sets used as primary section visuals
- Excessive drop shadows on everything
- Cookie-cutter hero sections (large text, subtitle, 2 buttons, done)
- "Powered by AI" badges as visual decoration
- Random floating shapes or orbs
- Stock photography or placeholder illustrations

## Design Language

Prefer:
- **Sophisticated typography** — Geist Sans for display, Geist Mono for data/technical
- **Strong black/white foundation** — the neutral oklch palette is intentional
- **Subtle accent colors** — color draws attention, not fills space
- **Cinematic compositions** — sections that tell a visual story
- **Dynamic motion** — framer-motion for meaningful transitions
- **Asymmetric layouts** — not everything centered in a max-width container
- **Editorial design** — varied section sizes, mixed layouts, visual rhythm
- **Intentional whitespace** — space is a design element, not wasted area
- **Subtle borders** — fine 1px borders for structure
- **Layered depth** — z-index, overlap, and transparency for dimensionality

## Inspiration References

Use these as **principle references**, NOT templates to copy:
- **Resend** — typography restraint, monospace accents, clean editorial
- **Linear** — product polish, interaction quality, dark mode excellence
- **Raycast** — interaction design, command palette UX, motion
- **Vercel** — visual hierarchy, technical elegance, spacing
- **Framer** — animation, creative compositions, editorial flair
- **Godly / Awwwards** — experimental web design, boundary-pushing layouts

Extract principles and create an **original StartTohKr identity**.

## Engineering Constraints

- Use the existing component architecture (`src/components/ui/` + `src/components/`)
- Do not introduce a new UI library without explicit justification
- Prefer reusable components over one-off implementations
- Do not duplicate CSS — use Tailwind utilities and design tokens
- Maintain responsive behavior on every change
- Do not sacrifice performance for decorative effects
- Keep client-side JS bundles lean
- Use `cn()` for conditional classes, not string concatenation

## Dark Mode

- Dark mode is a first-class design target, not an afterthought
- Test every component in both modes
- Dark mode should feel intentionally designed, not auto-inverted
- Use the existing `.dark` CSS custom properties in `globals.css`
