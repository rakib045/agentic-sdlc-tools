---
name: code-simplification
description: "Reduces complexity in working, tested code without changing behavior. Use when code works but is harder to read or change than it should be, often after a review."
---

# Code Simplification

Reduce complexity without changing behavior. Clarity over cleverness.

## When to use

The code works and is tested, but is harder to read or change than it should be. Often the pass after a review.

## When not to use

Behavior is still wrong, tests are missing, or you do not understand what the code is for.

## Process

1. Study conventions, callers, edge cases, and tests before touching anything.
2. Chesterton's fence: do not remove a check, comment, or branch until you know why it is there. If unsure, ask.
3. Scan for deep nesting, long functions, nested ternaries, generic names, duplication, dead code, and pass-through wrappers.
4. Apply one simplification at a time. Run tests after each. Revert any that fail.
5. Hand the result to `code-review-and-quality`.

Prefer moves that remove pieces over moves that relocate complexity.

## Red flags

- A diff that also changes outputs, error types, or timing.
- Deleted tests because they "no longer fit the design".
- A new framework introduced to make code "cleaner".

## Verification

Same tests pass before and after, build green, behavior unchanged. Say what got simpler in one sentence.
