---
name: spec-driven-development
description: "Writes a structured spec for new projects, features, or multi-module changes before implementation. Use when requirements are ambiguous or the work will take more than a short session."
---

# Spec-Driven Development

Write a structured specification before code. The spec is the shared source of truth. Code without a spec is guessing. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

A new project, feature, or change that touches multiple modules, takes more than a short session, or has ambiguous requirements.

## When not to use

A typo, a rename, or a change whose requirements are already unambiguous and local.

## Process

Do not advance a phase until the human has accepted it.

### Phase 0 — Scope check

Skip unless one request bundles several independently testable capabilities. If it does, propose a capability map before any spec:

- Stable kebab-case module ids, chosen once.
- One-way dependencies. A cycle means it is one module.
- Build order.

Wait for approval. Then spec each module in that order.

### Phase 1 — Specify

Surface assumptions first. Cover six areas:

1. Objective — what, why, who, success.
2. Commands — full commands discovered from this repo, not guessed tool names.
3. Project structure — where source, tests, and docs live.
4. Code style — one real snippet beats three paragraphs.
5. Testing strategy — framework, location, levels.
6. Boundaries — always do / ask first / never do.

Save to `SPEC.md` or `docs/spec.md` (or `SPEC-<id>.md` per module). If the project already uses another spec system, keep that format and still leave a spec where `agentic-sdlc-tools doctor` can see it.

Reframe vague requirements into testable conditions.

**Stop.** Summarize, list open questions, ask for approval. Do not plan or implement in this turn.

### Later phases

Planning is `/plan` (`planning-and-task-breakdown`). Implementation is `/build`. Do not collapse them into the spec turn.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "It's obvious." | Obvious requirements are where the wrong assumption hides. |
| "I'll spec it after a prototype." | The prototype becomes the spec, including the accidents. |
| "A README is enough." | A README is not a spec. |

## Red flags

- Success criteria that cannot fail a test.
- Tech choices with no constraint behind them.
- Open questions answered by the agent instead of the user.

## Verification

`SPEC.md` (or `docs/spec.md`) exists, the user has approved it, and `agentic-sdlc-tools doctor` reports `spec` PASS. No product code was written in the spec turn.
