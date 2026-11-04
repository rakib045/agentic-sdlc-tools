---
name: conventional-commits
description: "Writes Conventional Commits, branches, PRs, tags, and release notes for code changes. Use when committing, splitting a messy tree, opening a PR, or cutting a release."
---

# Conventional Commits and Git Workflow

Commits are save points. History is documentation.

## When to use

Any code change: committing, branching, splitting a messy tree, opening a PR, tagging, or cutting a release.

## Workflow

- Commit each verified slice. One logical change per commit, with its tests.
- Stage only the files for that commit. Never `git add -A` on a dirty tree.
- Aim for about 100 changed lines. Split larger changes.
- Do not rewrite published history. Do not commit secrets. Commit only when asked.

## Message format

```
type: subject
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`.

- Imperative subject, under 72 characters, no trailing period. It must stand alone in `git log --oneline`.
- Body optional: explain why, not the file list.

## Versioning

Use semver when the project already versions. Update the changelog in the same change. Tag only from a clean, green tree.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll commit once it all works." | Then you cannot revert the slice that broke it. |

## Red flags

- Secrets, build output, or unrelated files in the commit.
- A force-push to a shared branch.
- A release tag on a commit that did not pass CI.

## Verification

`git status` is clean for the intended scope, `git log` shows one concern per commit, and subjects match the format above.
