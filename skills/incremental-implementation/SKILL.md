---
name: incremental-implementation
description: "Implements changes in small, tested, independently revertable slices. Use for any change touching more than one file or the next task on a plan."
---

# Incremental Implementation

Build in thin vertical slices. Each slice leaves the system working.

## When to use

Any change touching more than one file, or the next task on a plan.

## When not to use

A single-function change that is already minimal. Still test it.

## Cycle

1. Implement the smallest complete piece.
2. Test first for new behavior (`test-driven-development`).
3. Verify: focused test, full suite, build. Report real output.
4. Commit one logical change (`conventional-commits`), staging only this slice's files.
5. Next slice. Never batch slices into one commit.

## Rules

- Simplest thing that works. Do not build for a hypothetical future.
- Do not clean up adjacent code or add unrequested features. Note them.
- One concern per slice. Never mix refactor, feature, and config.
- Always keep the tree buildable between slices.
- New user-facing work ships behind a flag, default off.
- About 100 changed lines is reviewable. Split before a thousand.

## Verification

Acceptance criteria pass, the suite and build are green, and the commit holds only that slice.
