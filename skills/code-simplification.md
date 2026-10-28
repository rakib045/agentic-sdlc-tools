# Code Simplification

Reduce complexity without changing behavior. Clarity over cleverness. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

The code works, tests cover it, and it is harder to read or change than it should be. Often the pass after a review.

## When not to use

Behavior is still wrong, tests are missing, or you do not yet understand what the code is for. Do not simplify code you cannot explain.

## Process

1. Read project conventions. Study callers, edge cases, and tests before touching anything.
2. Chesterton's fence: do not remove a check, comment, or branch until you know why it is there. If you cannot tell, leave it and ask.
3. Scan for: deep nesting, long functions, nested ternaries, generic names, duplicated logic, dead code, pass-through wrappers.
4. Apply one simplification at a time. Run tests after each. If a test fails, revert that change.
5. Rule of 500: when a file or function is growing past the point a reader can hold it, extract by responsibility before adding more. This is a readability signal, not a quota.
6. Hand the result to `code-review-and-quality`.

Prefer the move that removes pieces over the move that relocates the same complexity.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll rewrite it cleanly." | A rewrite changes behavior. Simplify in place, tests green. |
| "This abstraction will help later." | Later is not a requirement. Delete it if it has one caller and no clarity. |
| "The comment is noise." | The comment may be the only record of a bug. Confirm before deleting. |

## Red flags

- A simplification diff that also changes outputs, error types, or timing.
- Deleted tests because they "no longer fit the design".
- A new framework or pattern introduced to make code "cleaner".

## Verification

The same tests pass before and after, the build is green, and the diff does not change observable behavior. Say what got simpler in one sentence.
