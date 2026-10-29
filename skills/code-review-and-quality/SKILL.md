---
name: code-review-and-quality
description: "Five-axis code review before merge covering correctness, readability, architecture, security, and performance. Use before merging any change or when reviewing a diff or running /code-review."
---

# Code Review and Quality

Five-axis review before merge. Small changes, severity labels, tests first. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Before merging any change, or when `/code-review` is invoked. Use `review-checklist` as the short gate.

## When not to use

You are still implementing. Finish the slice, then review. In-flight cross-examination of a risky decision is `doubt-driven-development`, not this skill.

## Axes

1. **Correctness** — matches the spec, edges and errors handled, tests prove behavior.
2. **Readability** — names, structure, and control flow another engineer can follow.
3. **Architecture** — existing patterns, or a justified new one. Boundaries hold. No needless abstraction.
4. **Security** — load `security-and-hardening` when input, auth, or data is involved.
5. **Performance** — load `performance-optimization` for hot paths. Do not invent metrics.

## Process

1. Read the spec or task. What behavior should change?
2. Read the tests first. Do they test behavior? Would they fail if the logic were inverted? If you can flip a condition and the suite stays green, name the missing case.
3. Read the implementation. Propose a structural remedy, not only "this is complex": typed model, single flow, orchestration split from logic, delete a pass-through, extract a helper.
4. Label findings Critical, Required, Optional, or Nit. Critical and Required need `file:line` and a fix.
5. Check verification: tests run, build run, constraints not weakened (no new suppressions, skipped tests, or lowered thresholds).

## Change sizing

| Diff | Action |
|---|---|
| ~100 lines | Reviewable in one sitting. Target. |
| ~300 lines | Acceptable if it is one logical change. |
| ~1000 lines | Split, unless it is a deletion or a mechanical refactor. |

Watch file size too. A file approaching ~1000 lines should be decomposed before more is added. Separate refactor from feature work. Small renames may ride along; behavior changes may not.

Change descriptions stand alone: imperative first line, body explains why. "Fix bug" and "Phase 1" are not descriptions.

## Honesty

If you did not run the tests, say so. If you are unsure, say so and ask for investigation. Do not approve to be agreeable. Acknowledge one specific thing done well.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "Tests exist, so it's correct." | Existence is not proof. Check they fail when the behavior is wrong. |
| "It's only a little over the size guide." | Size is a reviewability limit, not a suggestion. |
| "Nit, but I'll block on style." | Nits do not block. Critical issues do. |

## Red flags

- Approval with failing or missing tests.
- Findings with no location.
- A review that only restates the diff.

## Verification

A verdict (Approve or Request changes), findings by severity, and a verification story that says what you actually ran.
