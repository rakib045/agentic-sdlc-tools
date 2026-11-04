---
description: Writes failing tests first, applies the Prove-It pattern to bugs, or assesses coverage gaps. Use when adding behavior, fixing a bug, or checking test quality.
agent: qa-engineer
subagent: false
---

# /test — Prove It Works

Invoke `test-driven-development`. For a bug, use Prove-It. If the failure is not understood, invoke `debugging-and-error-recovery`. For browser behavior, invoke `browser-testing-with-devtools`.

## New behavior

1. Discover the repo's test and full-suite commands. Do not assume `npm test`.
2. Write a test for the expected behavior. It must fail.
3. Implement the minimum to pass. Refactor while green.
4. Run the full suite. Report real output.

## Bug fix (Prove-It)

1. Write a test that reproduces the bug. It must fail on current code.
2. Fix the root cause. Confirm the test passes.
3. Run the full suite for regressions.

## Coverage pass

- Check happy path, empty input, boundaries, error paths, and concurrency.
- Report gaps as Critical / High / Medium / Low with the test name.

## Rules

- A test that cannot fail is not a test. Never delete, skip, or weaken a test to get green.
- Never mark untested behavior as done.
- Run `agentic-sdlc-tools doctor`. `test` should PASS when a manifest exists.
