---
description: Implements the next pending task from PLAN.md test-first, or runs every task with /build auto after one approval. Use when a spec and plan exist and code should be written.
agent: orchestrator
subagent: false
---

# /build — Implement the Plan

Delegate UI work to `senior-frontend-developer`, other work to `senior-backend-developer`, and independent proof to `qa-engineer`.

Invoke `incremental-implementation` and `test-driven-development`. On failure, invoke `debugging-and-error-recovery`. For auth, migrations, payments, deletions, or anything not reversible, invoke `doubt-driven-development` and get explicit sign-off.

## Modes

- `/build` — implement the next pending task, then stop.
- `/build auto` — after one approval, implement every task. Each task is still verified.

## Default: one task

1. Require `SPEC.md` or `docs/spec.md`. If missing, stop and run `/spec`.
2. Read the next pending task in `PLAN.md` and its acceptance criteria.
3. Write a failing test (RED). Confirm it fails.
4. Implement the minimum to pass (GREEN). Refactor without changing behavior.
5. Run the full suite and build.
6. Commit only this task's files plus the status update. See `conventional-commits`.
7. Mark the task complete and stop.

## Autonomous: `/build auto`

1. Require a spec (a README does not count). Run `git status`; if unrelated work is uncommitted, stop.
2. If there is no plan, generate one with `planning-and-task-breakdown`.
3. Present the full plan. Wait for an unambiguous yes. Commit the plan first.
4. Run each task in dependency order with the default loop. Stage only its files. Never `git add -A`.
5. Stop and ask when a test cannot pass, the spec is ambiguous, or a step is irreversible. Resume after the user resolves it.

## Rules

- No scope creep, secrets, dead code, silenced checks, or skipped tests.
- Keep the tree buildable after every slice. Unfinished user-facing work sits behind a default-off flag.
- Verify by execution. Report real output.
