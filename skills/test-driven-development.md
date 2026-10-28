# Test-Driven Development

Write a failing test before the code that makes it pass. For bugs, reproduce first. Tests are proof. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

New logic, a bug, a behavior change, or any request to add tests — including when the code is pasted inline and tests were not mentioned.

## When not to use

Docs, formatting, or config with no behavioral impact.

## Discover the stack first

Before the first test, find this repo's language, wrapper scripts, test framework, where tests live, and the CI command that gates merge. Use the focused-test command inside the loop and the full suite before completion. Do not assume `npm test`.

## Cycle

1. **Red.** Write the test. Run it. It must fail for the reason you expect.
2. **Green.** Write the minimum code to pass. Do not over-build.
3. **Refactor.** Clean up without changing behavior. Re-run tests after each cleanup.

## Prove-It (bugs)

Do not start at the fix.

1. Write a test that demonstrates the bug.
2. Confirm it fails.
3. Fix the root cause.
4. Confirm it passes.
5. Run the full suite.

## Pyramid and size

Most tests are small and fast (about 80% unit, 15% integration, 5% e2e). Pure logic with no I/O is a unit test. A boundary crossing is an integration test. A critical user flow is an e2e test. Test at the lowest level that captures the behavior.

Beyonce rule: if you liked the behavior, put a test on it. A refactor is not responsible for catching missing tests.

Prefer DAMP (descriptive, obvious tests) over DRY tests that hide the setup. One concept per test. No shared mutable state. Mock at system boundaries, not between internal functions. Avoid snapshots unless every snapshot change is reviewed. Names read like specifications.

## Browser

For UI behavior, pair this skill with `browser-testing-with-devtools`. A green unit test does not prove the browser.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll add tests later." | Later does not arrive, and the test will encode the bug. |
| "The test passed immediately, good." | A test that never failed proves nothing. |
| "E2E covers it." | E2E is slow and blunt. Put the logic in a small test. |
| "Skip it to get green." | A skipped test is a deleted requirement. |

## Red flags

- Production code written before a failing test, on a behavior change.
- Tests that assert private call order instead of observable results.
- Deleted assertions or `.skip` in the same change as a fix.

## Verification

You can show the red output and the later green output for the new test, plus the full-suite result.
