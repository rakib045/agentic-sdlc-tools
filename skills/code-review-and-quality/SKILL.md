---
name: code-review-and-quality
description: "Five-axis code review before merge covering correctness, readability, architecture, security, and performance. Use before merging any change or when reviewing a diff or running /code-review."
---

# Code Review and Quality

Five-axis review before merge. Small changes, severity labels, tests first.

## When to use

Before merging any change, or when `/code-review` is invoked. Use `review-checklist` as the short gate.

## When not to use

You are still implementing. Finish the slice first.

## Axes

1. **Correctness.** Matches the spec, errors handled, tests prove behavior.
2. **Readability.** Names and control flow another engineer can follow.
3. **Architecture.** Existing patterns, or a justified new one. Boundaries hold.
4. **Security.** Load `security-and-hardening` when input, auth, or data is involved.
5. **Performance.** Load `performance-optimization` for hot paths. Do not invent metrics.

## Process

1. Read the spec, then the tests. Would they fail if the logic were inverted?
2. Read the implementation. Propose a structural fix, not just "this is complex".
3. Label findings Critical, Required, Optional, or Nit. Critical and Required need `file:line` and a fix.
4. Confirm tests and build ran, and no suppressions, skipped tests, or lowered thresholds were added.

## Change sizing

| Diff | Action |
|---|---|
| ~100 lines | Target. |
| ~300 lines | Acceptable for one logical change. |
| ~1000 lines | Split, unless a deletion or mechanical refactor. |

Keep refactors separate from feature work. Change descriptions use an imperative first line and explain why.

## Honesty

If you did not run the tests, say so. Do not approve to be agreeable.

## Red flags

- Approval with failing or missing tests.
- Findings with no location.

## Verification

A verdict (Approve or Request changes), findings by severity, and what you actually ran.
