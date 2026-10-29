---
name: frontend-ui-engineering
description: "Builds and changes user-facing UI in the browser or native apps with accessible, responsive, production-quality interfaces. Use when creating or changing anything a person sees or operates."
---

# Frontend UI Engineering

Build user-facing UI that matches the existing design system, works without a mouse, and survives real content. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Creating or changing anything a person sees or operates in a browser or native UI.

## When not to use

Libraries, CLIs, and services with no user-facing surface. Do not apply component advice from a framework this repo does not use (`source-driven-development`).

## Process

1. Match the existing component, styling, and state patterns. Do not introduce a second design system in a feature slice.
2. Structure by responsibility. State lives as close to its owner as possible. Do not lift state "just in case".
3. Layout must tolerate long text, empty states, errors, and narrow viewports. Reserve space for media so content does not jump.
4. Accessibility is part of done, not a follow-up: keyboard operation, visible focus, accessible names, contrast that meets WCAG 2.1 AA, errors associated with fields, no information by color alone.
5. Prefer semantic elements over clickable divs and ARIA that restates the native role.
6. Verify in a browser when the behavior is visual or interactive (`browser-testing-with-devtools`). Unit tests do not prove focus order.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "We'll accessibility-pass it later." | Later is a rewrite of the interaction. Do it in the slice. |
| "The design tool didn't show the empty state." | Empty, error, and long text are requirements, not polish. |
| "A div with onClick is faster." | It is also invisible to the keyboard unless you rebuild a button. |

## Red flags

- A new UI library beside an existing one.
- Interactive elements with no name and no keyboard path.
- Layout that only works with the placeholder string.

## Verification

The slice matches local UI patterns, keyboard and empty/error states are described or demonstrated, and visual behavior was checked in a browser or explicitly marked unverified.
