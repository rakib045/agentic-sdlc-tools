---
name: planning-and-task-breakdown
description: "Breaks a spec into ordered, verifiable, appropriately sized tasks with dependencies and checkpoints. Use when a spec is too large to start or will span sessions."
---

# Planning and Task Breakdown

Decompose a spec into small, verifiable tasks with acceptance criteria and dependency order. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

A spec exists and the work is too large to start, needs an implementation order, or will be split across sessions.

## When not to use

A single-file change with obvious scope, or a spec that already contains well-sized tasks.

## Process

This is read-only. The output is a plan, not code.

1. Read `SPEC.md` (or `docs/spec.md`) and the relevant code. If there is no spec, stop and run `/spec`.
2. If `PLAN.md` already has unchecked tasks for different work, stop and ask. Never overwrite an in-progress plan.
3. Map the dependency graph. Build foundations first, but deliver vertical slices: one complete path (data, interface, and the caller that proves it) per task. Do not plan "all schema, then all APIs, then all UI".
4. Write each task with: description, testable acceptance criteria, verification commands, dependencies, files likely touched, and size.
5. Order so each task leaves the system working. Put high-risk tasks early. Add a human checkpoint every few tasks.
6. Save architecture decisions, risks, and the ordered task list to `PLAN.md` (or `docs/plan.md`). If the project tracks work in an external tracker, index those ids from `PLAN.md` instead of duplicating the checklist.
7. Present the plan and stop. Implementation is a later turn.

## Sizing

| Size | Guidance |
|---|---|
| S | 1–2 files, one endpoint or function |
| M | 3–5 files, one feature slice |
| L or XL | Split. More than one session, more than one subsystem, or "and" in the title. |

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll figure out the order while coding." | That is how slices get tangled and unverifiable. |
| "Horizontal layers are cleaner." | They are not demoable or testable until the end. |

## Red flags

- Tasks with no acceptance criteria.
- A task that cannot be verified by a command or a manual check.
- A plan that starts implementing "just the types".

## Verification

`PLAN.md` exists, tasks are ordered, each has acceptance criteria and a verification step, and the user has been asked to approve before build. `agentic-sdlc-tools doctor` reports `plan` PASS.
