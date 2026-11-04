---
description: Turns an approved SPEC.md into an ordered, verifiable task plan in PLAN.md without writing product code. Use after a spec is approved and before building.
agent: solution-architect
subagent: false
---

# /plan — Plan the Implementation

Invoke `planning-and-task-breakdown`. Use `api-and-interface-design` for contracts and `adr-writing` for expensive-to-reverse decisions. If no quality bar is written down and the work is non-trivial, invoke `constraint-driven-development` before autonomous build.

This command is read-only. Do not write product code.

## Steps

1. Read `SPEC.md` (or `docs/spec.md`). If none exists, stop and tell the user to run `/spec`. A README does not count.
2. If `PLAN.md` or `docs/plan.md` already has unchecked tasks for different work, stop and ask. Never silently overwrite an incomplete plan.
3. Read the relevant code. Map dependencies. Note risks and unknowns.
4. Propose 2–3 approaches with trade-offs. Recommend the simplest one that meets the spec.
5. Slice vertically: each task is one complete, testable path, not a horizontal layer. Split anything that would touch two subsystems or take more than one focused session.
6. For each task record: description, acceptance criteria, verification commands, dependencies, files likely touched, and size (S or M). Put high-risk tasks early. Add a checkpoint every few tasks.
7. Save or update `PLAN.md` (or `docs/plan.md`) with the architecture notes and the ordered task list in the same file.
8. Present the plan for human review. Do not start `/build` in this turn.
9. CLI check: `agentic-sdlc-tools doctor` — `plan` should PASS.

## Rules

- Prefer the simplest approach that meets the spec.
- Flag unknowns explicitly. Do not hide risk.
- If two modules depend on each other, they are one module.
