---
name: spec-driven-development
description: "Writes a structured spec for new projects, features, or multi-module changes before implementation. Use when requirements are ambiguous or the work will take more than a short session."
---

# Spec-Driven Development

Write a structured spec before code. The spec is the shared source of truth.

## When to use

A new project, feature, or change that touches multiple modules, takes more than a short session, or has ambiguous requirements. Not for typos, renames, or unambiguous local changes.

## Process

Do not advance a phase until the human has accepted it.

### Phase 0 — Scope check

If one request bundles several independently testable capabilities, propose a module map before any spec:

- Stable kebab-case module ids.
- One-way dependencies. A cycle means one module.
- Build order.

Wait for approval, then spec each module in order.

### Phase 1 — Specify

Surface assumptions. Cover six areas: objective, commands (from this repo), project structure, code style (one real snippet), testing strategy, and boundaries (always / ask first / never).

Save to `SPEC.md` or `docs/spec.md` (or `SPEC-<id>.md` per module). Keep another spec system's format if the project uses one, but leave a spec where `agentic-sdlc-tools doctor` can see it. Reframe vague requirements into testable conditions.

**Stop.** Summarize, list open questions, and ask for approval. Do not plan or implement in this turn.

### Later phases

Planning is `/plan` (`planning-and-task-breakdown`). Implementation is `/build`. Do not collapse them into the spec turn.

## Red flags

- Success criteria that cannot fail a test.
- Open questions answered by the agent instead of the user.

## Verification

`SPEC.md` (or `docs/spec.md`) exists, the user approved it, and `agentic-sdlc-tools doctor` reports `spec` PASS. No product code was written in the spec turn.
