---
name: debugging-and-error-recovery
description: "Localizes and fixes failing tests, broken builds, wrong runtime behavior, and regressions systematically. Use when a test fails, the build breaks, or a bug is reported."
---

# Debugging and Error Recovery

Stop adding features. Find the root cause, fix it, and guard it. Guessing wastes time.

## When to use

A test fails, the build breaks, runtime behavior is wrong, or a bug is reported.

## Stop the line

1. Stop adding features or further edits.
2. Preserve the error output and repro steps.
3. Diagnose with the triage below.
4. Fix the root cause, then guard it with a test (`test-driven-development`).
5. Resume only after verification passes. Do not push past a red suite.

## Triage

1. **Reproduce.** If it does not fail on demand, you cannot confirm the fix.
2. **Localize.** Which layer: UI, API, database, build, external service, or the test itself?
3. **Reduce.** Smallest input, one variable at a time. Read the error before changing code.
4. **Fix.** Change the cause, not a symptom. Do not add a retry or broad catch to hide it.
5. **Guard.** A regression test that fails before the fix and passes after. Run the full suite with this repo's test command.

## Safe fallbacks

If you cannot fix it now, revert the slice, flag the feature off, or return a safe error. Never leave a known-broken path enabled.

## Red flags

- A fix with no repro.
- Speculative edits before reading the error.
- A catch that swallows the exception to get green.

## Verification

Repro steps, the root cause in one sentence, the guarding test's red-then-green output, and a green full suite.
