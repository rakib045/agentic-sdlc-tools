---
name: frontend-ui-engineering
description: "Builds and changes user-facing UI in the browser or native apps with accessible, responsive, production-quality interfaces. Use when creating or changing anything a person sees or operates."
---

# Frontend UI Engineering

Build user-facing UI that matches the existing design system, works without a mouse, and survives real content.

## When to use

Creating or changing anything a person sees or operates in a browser or native UI.

## When not to use

Libraries, CLIs, and services with no user-facing surface.

## Process

1. Match the existing component, styling, and state patterns. Do not add a second design system.
2. Keep state close to its owner.
3. Layout must tolerate long text, empty states, errors, and narrow viewports.
4. Accessibility is part of done: keyboard operation, visible focus, accessible names, WCAG 2.1 AA contrast, no information by color alone.
5. Prefer semantic elements over clickable divs.
6. Verify visual or interactive behavior in a browser. Unit tests do not prove focus order.

## Red flags

- A new UI library beside an existing one.
- Interactive elements with no name and no keyboard path.

## Verification

The slice matches local UI patterns, keyboard and empty/error states are covered, and visual behavior was checked in a browser or marked unverified.
