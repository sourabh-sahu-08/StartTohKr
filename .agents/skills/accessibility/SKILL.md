---
name: Accessibility
description: Ensure WCAG 2.1 AA compliance and inclusive design across all UI components and pages. Activate when building interactive elements, forms, navigation, or reviewing accessibility concerns.
---

# Accessibility

## Standard

All UI must meet **WCAG 2.1 Level AA** as a minimum baseline.

## Semantic HTML

- Use semantic elements: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`
- Use a single `<h1>` per page
- Follow logical heading hierarchy: h1 → h2 → h3 (never skip levels)
- Use `<button>` for actions, `<a>` for navigation — never interchange them
- Use `<ul>`/`<ol>` for lists, `<table>` for tabular data
- Use `<form>` elements with proper `<label>` associations

## Keyboard Navigation

- All interactive elements must be reachable via Tab
- Tab order must follow visual/logical reading order
- Focus must be visible — never `outline: none` without a replacement
- Modal dialogs must trap focus
- Escape key should close modals, dropdowns, and overlays
- Custom components must handle Enter and Space for activation
- Skip links should be present for main content

## ARIA

- Prefer semantic HTML over ARIA — ARIA is a supplement, not a replacement
- Use `aria-label` for icon-only buttons
- Use `aria-live` regions for dynamic content updates
- Use `aria-expanded` for toggleable components
- Use `role="alert"` for error messages
- Use `aria-describedby` to associate help text with form fields
- Never use `aria-hidden="true"` on focusable elements

## Color & Contrast

- Text contrast ratio: minimum 4.5:1 (normal text), 3:1 (large text)
- Interactive element boundaries: 3:1 against adjacent colors
- Never use color as the only means of conveying information
- Test both light and dark modes for contrast compliance
- Ensure disabled states are distinguishable without relying on color alone

## Forms

- Every input must have a visible, associated `<label>`
- Error messages must be programmatically associated (`aria-describedby`)
- Required fields must be indicated (both visually and with `aria-required`)
- Error states must not rely solely on color (use icons, text, borders)
- Group related inputs with `<fieldset>` and `<legend>`
- Provide clear, specific error messages ("Email is required" not "Error")

## Images & Media

- All informative images must have descriptive `alt` text
- Decorative images: `alt=""` and `aria-hidden="true"`
- Complex images (charts, diagrams): provide text alternatives
- Videos should have captions where applicable
- Avoid auto-playing media

## Motion & Animation

- Always respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- Do not use flashing content (>3 flashes per second)
- Provide controls for any auto-advancing content (carousels, etc.)

## Touch Targets

- Minimum interactive target size: 44×44px (CSS pixels)
- Adequate spacing between adjacent targets (min 8px gap)
- Links within text should have sufficient padding

## Testing Checklist

Before shipping any UI:
- [ ] Navigate the entire page using only keyboard (Tab, Enter, Escape, Arrow keys)
- [ ] Verify all focus states are visible
- [ ] Check heading hierarchy with a document outline tool
- [ ] Test with browser zoom at 200%
- [ ] Verify color contrast of all text elements
- [ ] Ensure all images have appropriate alt text
- [ ] Test form submission with empty, invalid, and valid data
- [ ] Verify error announcements with screen reader (or check ARIA markup)
- [ ] Test in both light and dark modes
