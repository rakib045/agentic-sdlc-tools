---
name: api-and-interface-design
description: "Designs APIs, module boundaries, public types, and events as stable contracts. Use when adding or changing an API, boundary, or event, or when two sides must be built in parallel."
---

# API and Interface Design

Design the contract before the implementation. Interfaces are forever more than you think.

## When to use

A new or changed API, module boundary, public type, or event. Also when two sides must be built in parallel.

## Principles

- **Hyrum's Law.** Every observable behavior becomes a dependency, including errors, ordering, and latency.
- **One live contract.** Version only when required, and plan the removal.
- **Contract first.** Write request, response, and errors before the handler.
- **Consistent errors.** One error model. Callers branch on stable codes, not message text.
- **Validate at the boundary.** Internal code trusts validated types.
- **Prefer addition.** Removing or renaming is a breaking change.
- **Idempotency and pagination.** Retried mutations are idempotent. List endpoints are bounded.

Match the codebase's naming.

## Process

1. Name the callers and what they must not depend on.
2. Draft inputs, outputs, error codes, authz, idempotency, and pagination.
3. Review the draft against Hyrum's Law.
4. Record breaking changes as an ADR (`adr-writing`).
5. Implement against the contract. Tests assert the contract, not private helpers.

## Red flags

- Breaking changes with no version or migration note.
- Validation only in the UI.
- Two error shapes in one API.

## Verification

The contract is written down, boundary tests cover success and error codes, and breaking changes have an ADR.
