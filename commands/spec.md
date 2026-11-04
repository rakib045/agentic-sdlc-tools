---
description: Writes or updates SPEC.md with user stories, acceptance criteria, and boundaries, then stops for approval. Use when requirements are new or unclear and no approved spec exists.
agent: product-owner
subagent: false
---

# /spec — Write a Specification

Invoke `spec-driven-development`. If who, why, success, or the binding constraint is missing, invoke `interview-me`. For a rough idea, invoke `idea-refine`.

Do not implement or plan in this turn.

## Steps

1. List assumptions. Correct them first.
2. If the request has several independent capabilities, propose a capability map and wait for approval. Spec each module in dependency order as `SPEC-<id>.md`.
3. Write `SPEC.md` (or `docs/spec.md`): objective, users, Given/When/Then user stories, commands, testing strategy, boundaries (always / ask first / never), measurable success criteria, out of scope, open questions.
4. Replace vague goals with testable conditions.
5. Summarize open questions and ask for approval.
6. **Stop** until the human approves.
7. Run `agentic-sdlc-tools doctor`. `spec` should PASS.

## Rules

- No implementation. Ambiguity is an open question, not a guess.
- A README is not a spec.
