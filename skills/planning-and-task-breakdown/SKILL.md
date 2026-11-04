---
name: planning-and-task-breakdown
description: "Breaks a spec into ordered, verifiable, appropriately sized tasks with dependencies and checkpoints. Use when a spec is too large to start or will span sessions."
---

# Planning and Task Breakdown

Decompose a spec into small, verifiable tasks with acceptance criteria and dependency order.

## When to use

A spec exists and the work is too large to start, needs an order, or spans sessions.

## Process

Read-only. The output is a plan, not code.

1. Read `SPEC.md` (or `docs/spec.md`) and the relevant code. If there is no spec, stop and run `/spec`.
2. If `PLAN.md` has unchecked tasks for other work, stop and ask. Never overwrite it.
3. Plan vertical slices: one complete path per task. Never "all schema, then all APIs, then all UI".
4. Each task gets: description, testable acceptance criteria, verification commands, dependencies, files likely touched, and size.
5. Order so each task leaves the system working. Put high-risk tasks early. Add checkpoints every few tasks.
6. Save decisions, risks, and the ordered list to `PLAN.md` (or `docs/plan.md`). Index external tracker ids instead of duplicating them.
7. Present the plan and stop. Implementation is a later turn.

## Sizing

- S: 1–2 files, one endpoint or function.
- M: 3–5 files, one feature slice.
- L or XL: split. More than one session, subsystem, or "and" in the title.

## Verification

`PLAN.md` exists, tasks are ordered, each has acceptance criteria and a verification step, and the user approved before build. `agentic-sdlc-tools doctor` reports `plan` PASS.
