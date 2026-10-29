---
name: debugging-and-error-recovery
description: "Localizes and fixes failing tests, broken builds, wrong runtime behavior, and regressions systematically. Use when a test fails, the build breaks, or a bug is reported."
---

# Debugging and Error Recovery

Stop adding features. Preserve evidence. Find the root cause, fix it, and guard it. Guessing wastes time. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

A test fails, the build breaks, runtime behavior is wrong, a bug is reported, or something that worked yesterday stopped.

## Stop the line

1. Stop adding features or further edits.
2. Preserve the error output, logs, and repro steps.
3. Diagnose with the checklist below. Do not skip steps.
4. Fix the root cause.
5. Guard with a test (`test-driven-development` Prove-It).
6. Resume only after verification passes.

Do not push past a red suite to start the next task.

## Triage

1. **Reproduce.** If you cannot make it fail on demand, you cannot be sure you fixed it. Check timing, environment, and leaked state before calling it random. Document non-reproducible conditions and add a targeted log or alert.
2. **Localize.** Which layer: UI, API, database, build, external service, or the test itself? Bisect. A failing test can be wrong.
3. **Reduce.** Smallest input, smallest diff, one variable at a time. Read the error before changing code.
4. **Fix.** Change the cause, not a symptom. Do not wrap the failure in a retry or a broader catch unless the spec says transient failure is expected.
5. **Guard.** A regression test that failed before the fix and passes after it. Run the full suite.

Use this repo's test command, not a remembered default.

## Safe fallbacks

If you cannot fix it now: revert the slice, flag the feature off, or return a safe error. Do not leave a known-broken path enabled. Say what you reverted and why.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I know what it is." | Then you can write the failing test first. |
| "It works on my machine." | Compare versions, env, and data before concluding that. |
| "Retry will cover it." | A retry hides the cause and makes the next failure worse. |

## Red flags

- A fix with no repro.
- Multiple speculative edits before reading the error.
- A catch that swallows the exception to get green.

## Verification

Repro steps, the root cause in one sentence, the guarding test's red-then-green output, and a green full suite.
