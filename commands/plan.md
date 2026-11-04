---
description: Turns an approved SPEC.md into an ordered, verifiable task plan in PLAN.md without writing product code. Use after a spec is approved and before building.
agent: solution-architect
subagent: false
---

# /plan — Plan the Implementation

Invoke `planning-and-task-breakdown`. Use `api-and-interface-design` for contracts and `adr-writing` for hard-to-reverse decisions.

Read-only. Do not write product code.

## Steps

1. Read `SPEC.md` (or `docs/spec.md`). If missing, stop and tell the user to run `/spec`.
2. If `PLAN.md` has unchecked tasks for other work, stop and ask. Never overwrite an incomplete plan.
3. Read the relevant code. Note dependencies, risks, and unknowns.
4. Propose 2–3 approaches. Recommend the simplest that meets the spec.
5. Slice vertically. Each task is one testable path with acceptance criteria, verification commands, and size (S or M). Put high-risk tasks early.
6. Save `PLAN.md` with architecture notes and the ordered tasks.
7. Present the plan for review. Do not start `/build`.
8. Run `agentic-sdlc-tools doctor`. `plan` should PASS.

## Rules

- Prefer the simplest approach. Flag unknowns. Do not hide risk.
- Modules that depend on each other are one module.
