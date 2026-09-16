---
name: Visual QA
description: Inspect frontend implementations visually in the browser and iteratively improve UI quality. Activate after implementing significant UI changes, new pages, or layout modifications.
---

# Visual QA

## Core Principle

Never declare UI work complete based solely on source code.

Code that compiles and renders is not the same as code that looks good. Visual correctness takes priority over implementation convenience.

## Workflow

After implementing significant UI changes:

1. **Start the development server** if it is not already running.
2. **Open the page in the browser** using the browser subagent or Chrome DevTools MCP.
3. **Capture or inspect the rendered result** — do not rely on mental models of what the code should produce.
4. **Evaluate** against the checklist below.
5. **Identify the 3 biggest visual problems.**
6. **Fix them** in code.
7. **Inspect again** in the browser to confirm the fix.
8. **Repeat** until no major issues remain.

## Inspection Checklist

Check each of the following:

### Spacing
- Is vertical rhythm consistent?
- Are padding and margins visually balanced, not just numerically consistent?
- Is there enough breathing room between sections?
- Do nested elements have appropriate internal spacing?

### Typography
- Are font sizes creating a clear hierarchy?
- Is line height comfortable for reading?
- Are line lengths appropriate (45–75 characters for body)?
- Is letter-spacing correct on display text?
- Are font weights used sparingly and consistently?

### Alignment
- Are elements aligned to a consistent grid?
- Are baselines aligned across columns?
- Do centered elements look intentionally centered?
- Are left-aligned elements consistently left-aligned?

### Responsive Behavior
- Check at **desktop** (1280px+)
- Check at **tablet** (768px)
- Check at **mobile** (375px)
- Does content reflow gracefully or break awkwardly?
- Are touch targets large enough on mobile?
- Does navigation work on all breakpoints?

### Contrast & Readability
- Is text readable against its background?
- Do interactive elements have visible focus states?
- Are disabled states distinguishable?
- Does the dark mode variant look intentionally designed?

### Hierarchy
- Can you identify the most important element within 2 seconds?
- Is the reading order logical?
- Are CTAs visually prominent?
- Are secondary elements visually de-emphasized?

### Animation & Interaction
- Do animations feel smooth (60fps)?
- Are hover states present on interactive elements?
- Do transitions feel appropriately fast?
- Is there animation jank on scroll?

### Overflow & Edge Cases
- Is text truncating gracefully where expected?
- Are images constrained properly?
- Is horizontal scrolling absent where it should be?
- Do long strings break the layout?
- Are empty states handled visually?

### Visual Consistency
- Do similar elements look similar across pages?
- Are colors from the design system, not ad-hoc?
- Are border radii, shadows, and spacing consistent?
- Does the page feel like it belongs to the same product?

## Viewport Breakpoints

Always check at these minimum widths:
- **375px** — iPhone SE / small mobile
- **768px** — iPad / tablet portrait
- **1280px** — Standard desktop
- **1440px** — Large desktop (optional)

## Using Chrome DevTools MCP

If Chrome DevTools MCP is available, use it to:
- Take screenshots at specific viewports (`take_screenshot`, `resize_page`)
- Inspect element dimensions and spacing
- Check accessibility contrast ratios
- Verify animation performance
- Test interaction states (hover, focus, active)

## Using Browser Subagent

If using the browser subagent:
- Navigate to the page
- Resize to each breakpoint
- Interact with elements (hover, click, scroll)
- Capture screenshots for comparison
- Verify that animations trigger correctly

## Priority of Fixes

When multiple issues exist, fix in this order:
1. **Broken layouts** (overflow, misalignment, responsive failures)
2. **Hierarchy problems** (unclear what to focus on)
3. **Spacing issues** (cramped or unbalanced sections)
4. **Typography problems** (unreadable, wrong weights, poor sizing)
5. **Color/contrast issues**
6. **Missing interactions** (hover states, transitions)
7. **Polish** (animation timing, micro-interactions, edge cases)

## Final Check

Before signing off on any UI work, ask:
- Would I be comfortable showing this to a design-savvy client?
- Does this feel like a finished product, or a work-in-progress?
- Is there any section that looks "off" even if I can't immediately explain why?

If anything feels wrong, investigate and fix it.
