---
name: test-driven-development
description: "Writes failing tests first, then the minimal code to pass, then refactors. Use for new logic, bug fixes, behavior changes, or any request to add tests."
---

# Test-Driven Development

Write a failing test before the code that makes it pass. For bugs, reproduce first. Tests are proof.

## When to use

New logic, a bug, a behavior change, or any request to add tests, even when tests were not mentioned. Not for docs, formatting, or config with no behavioral impact.

## Discover the stack first

Find the language, wrapper scripts, test framework, test location, and the CI command that gates merge. Use the focused-test command in the loop and the full suite before completion. Do not assume `npm test`.

## Cycle

1. **Red.** Write the test. Run it. It must fail for the expected reason.
2. **Green.** Write the minimum code to pass.
3. **Refactor.** Clean up without changing behavior. Re-run tests.

## Prove-It (bugs)

1. Write a test that demonstrates the bug and confirm it fails.
2. Fix the root cause and confirm it passes.
3. Run the full suite.

## Style

- About 80% unit, 15% integration, 5% e2e. Test at the lowest level that captures the behavior.
- Prefer DAMP tests over DRY tests that hide setup. Mock at system boundaries only.
- Assert observable results, not private call order.

## Browser

For UI behavior, a green unit test does not prove the browser. Verify in a real browser too.

## Red flags

- Production code written before a failing test, on a behavior change.
- Deleted assertions or `.skip` in the same change as a fix.

## Verification

Show the red output, the later green output for the new test, and the full-suite result.
