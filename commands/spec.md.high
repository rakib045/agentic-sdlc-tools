---
description: Writes or updates SPEC.md with user stories, acceptance criteria, and boundaries, then stops for approval. Use when requirements are new or unclear and no approved spec exists.
agent: product-owner
subagent: false
---

# /spec — Write a Specification

Invoke `spec-driven-development`. If the ask is missing who, why, success, or the binding constraint, invoke `interview-me` first. If the idea is still a rough concept, invoke `idea-refine` before writing the spec.

Do not implement. Do not start planning in this turn.

## Steps

1. Surface assumptions in a short numbered list. Correct them before writing.
2. If the request bundles several independently testable capabilities, propose a capability map (stable kebab-case ids, one-way dependencies, build order) and wait for approval. Then spec each module in dependency order (`SPEC-<id>.md`). Single-capability work skips this step.
3. Write a spec covering:
   - Objective, users, and why now
   - User stories with Given/When/Then acceptance criteria
   - Commands (full commands, not tool names) — discover them from the repo
   - Project structure and code style, with one real snippet if the repo has a convention
   - Testing strategy
   - Boundaries: always do / ask first / never do
   - Success criteria (measurable), out of scope, open questions
4. Reframe vague goals into testable conditions. "Faster" is not a criterion.
5. Save or update `SPEC.md` (or `docs/spec.md`). If the project already uses another spec system, keep that format and still make `doctor` able to see a spec at `SPEC.md`, `spec.md`, or `docs/spec.md`.
6. Summarize and list open questions. Ask for approval.
7. **Stop.** Do not invoke planning or write code until the human approves in a later turn.
8. CLI check after the file exists: `agentic-sdlc-tools doctor` — `spec` should PASS.

## Rules

- No implementation. Ambiguity is an open question, not a guess.
- Do not treat a README as a spec.
- Keep it minimal but complete.
