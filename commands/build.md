# /build — Implement the Plan

Invoke `incremental-implementation` and `test-driven-development`. On failure, invoke `debugging-and-error-recovery`. On auth, migrations, payments, deletions, or anything you cannot undo with revert, invoke `doubt-driven-development` and get explicit sign-off.

Act as Senior Developer.

## Modes

- `/build` — implement the next pending task, then stop.
- `/build auto` — plan if needed, get one approval, then implement every task. This removes the human step between tasks, not the verification. Every task is still test-driven and committed on its own.

Treat `auto` or `all` as autonomous mode. Anything else is single-task mode.

## Default: one task

1. Require `SPEC.md` or `docs/spec.md`. If missing, stop and run `/spec`. Do not invent requirements.
2. Read the next pending task in `PLAN.md` and its acceptance criteria. Load surrounding code and conventions (`context-engineering`).
3. Write a failing test (RED). Confirm it fails.
4. Implement the minimum code to pass (GREEN).
5. Refactor without changing behavior. Run the full suite and the build.
6. Commit only the files this task touched, plus the task-status update. One logical change. See `conventional-commits`.
7. Mark the task complete and stop.

## Autonomous: `/build auto`

1. Require a spec at `SPEC.md`, `docs/spec.md`, or `spec/`. A README does not count.
2. Run `git status`. If unrelated uncommitted work exists, stop. Autonomous commits must not absorb it.
3. If there is no plan, generate one with `planning-and-task-breakdown` and save it to `PLAN.md`.
4. Present the full plan. Wait for an unambiguous yes ("approve", "go", "yes"). Hedged replies are not approval. Commit the plan first so it does not bleed into the first task commit.
5. Execute every task in dependency order using the default loop. Stage only that task's files. Never `git add -A`.
6. Stop and ask — do not push through — when a test cannot pass, the spec is ambiguous, or the step is high-risk or irreversible. After the user resolves it, `/build auto` resumes at the next pending task.
7. Summarize tasks completed, tests added, commits made, and anything skipped.

## Rules

- No scope creep. No secrets. No dead code. No silenced checks. No skipped tests.
- Leave the tree buildable after every slice. Incomplete user-facing work stays behind a flag, default off.
- Verify by execution. Report real command output.
