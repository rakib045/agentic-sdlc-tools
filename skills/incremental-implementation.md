# Incremental Implementation

Build in thin vertical slices. Implement, test, verify, commit, then expand. Each slice leaves the system working. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Any change that touches more than one file, the next task on a plan, or any urge to write a large batch before testing.

## When not to use

A single-function change that is already minimal. Still test it.

## Cycle

1. Implement the smallest complete piece.
2. Test — failing test first for new behavior (`test-driven-development`).
3. Verify — focused test, full suite, build. Report real output.
4. Commit — one logical change (`conventional-commits`). Stage only this slice's files.
5. Next slice. Do not restart, and do not batch slices into one commit.

## Rules

- **Simplest thing that works.** Three similar lines beat a premature abstraction. Review before finishing: fewer lines? abstractions earning their cost? building for a hypothetical future?
- **Scope.** Do not clean up adjacent code, delete comments you do not understand, or add unrequested features. Note them and move on.
- **One concern per slice.** Do not mix a refactor, a feature, and a config change.
- **Always buildable.** Do not leave the tree broken between slices.
- **Flags for incomplete user-facing work.** Default off. Safe defaults on new options.
- **Rollback-friendly.** Prefer additive changes. Migrations need a down path.
- **About 100 changed lines** is a reviewable slice. Split before you approach a thousand.

Contract-first when two sides must move in parallel: agree the contract, implement each side against it, then integrate. Risk-first when one unknown can kill the design — prove that slice before investing in the rest.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll test when the feature is done." | A broken middle slice makes every later slice wrong. |
| "While I'm here I'll tidy this." | That belongs in a separate change. |
| "A flag is extra work." | A long branch is more expensive, and main stops being deployable. |

## Red flags

- A slice with no test and no manual check.
- `git add -A` on a dirty tree.
- New behavior enabled by default before it is ready.

## Verification

The slice's acceptance criteria pass, the suite and build are green, and the commit contains only that slice.
