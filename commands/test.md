# /test — Prove It Works

Invoke `test-driven-development`. For a bug, use the Prove-It pattern. If the failure is not understood, invoke `debugging-and-error-recovery` before changing production code. For browser behavior, also invoke `browser-testing-with-devtools`.

Act as QA Engineer. This command runs the test workflow in the main session. It does not spawn other personas.

## New behavior

1. Discover this repo's test runner, focused-test command, and full-suite command. Do not assume `npm test`.
2. Write a test that describes the expected behavior. It must fail.
3. Implement the minimum code to pass.
4. Refactor while the suite stays green.
5. Run the full suite. Report the real output.

## Bug fix (Prove-It)

1. Write a test that reproduces the bug. It must fail on current code.
2. Confirm the failure and show the output.
3. Fix the root cause, not the symptom.
4. Confirm the test passes.
5. Run the full suite for regressions.

## Coverage pass

When asked to assess tests rather than write a feature:

- Happy path, empty input, boundaries, error paths, concurrency.
- Test behavior, not implementation details. One concept per test. Mock only at system boundaries.
- Report gaps as Critical / High / Medium / Low with the test name and why it matters.

## Rules

- A test that already passes proves nothing. A test that cannot fail is not a test.
- Never delete, skip, or weaken a test to get green.
- Never mark untested behavior as done.
- CLI check: `agentic-sdlc-tools doctor` — `test` should PASS when a project manifest exists (`package.json`, `pyproject.toml`, or `go.mod`).
