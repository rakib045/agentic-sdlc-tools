---
name: conventional-commits
description: "Writes Conventional Commits, branches, PRs, tags, and release notes for code changes. Use when committing, splitting a messy tree, opening a PR, or cutting a release."
---

# Conventional Commits and Git Workflow

Commits are save points. History is documentation. This skill covers commit format, atomic history, and versioning. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Any code change: committing, branching, splitting a messy tree, opening a PR, tagging, or cutting a release.

## Workflow

- Prefer trunk-based development: `main` always deployable, branches living 1–3 days. Feature flags beat long-lived branches. Adapt the commit rules if the team uses another model; the commit discipline matters more than the branch names.
- Commit each verified slice. Do not accumulate a giant uncommitted change.
- One logical change per commit. Tests for that change belong in it. Do not mix a refactor, a feature, and a dependency bump.
- Stage only the files for that commit. Never `git add -A` on a dirty tree.
- About 100 changed lines is reviewable. Split before a change becomes a thousand lines, unless it is a deletion or a mechanical refactor.
- Do not rewrite published history. Do not commit secrets. Do not commit unless the user asked or the active command (`/build`) says to.

## Message format

```
type: subject
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`.

- Imperative subject, under 72 characters, no trailing period.
- The subject stands alone in `git log --oneline`. "Fix bug" and "Phase 1" do not.
- Body optional: why, and what the diff cannot show. Not a restatement of the file list.

## Versioning

Semantic versioning when the project already versions: fix → patch, compatible feature → minor, breaking change → major. Update the changelog in the same change as the bump. Tag the release only from a clean, green tree (`shipping-and-launch`).

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll commit once it all works." | Then you cannot revert the slice that broke it. |
| "The subject can be vague; the diff is the message." | The next search of history will not open the diff. |
| "One commit is easier to review." | One commit that does three things is harder to review and harder to revert. |

## Red flags

- Secrets, build output, or unrelated files in the commit.
- A force-push to a shared branch.
- A release tag on a commit that did not pass CI.

## Verification

`git status` is clean for the intended scope, `git log` shows one concern per commit, and the subject matches the format above.
