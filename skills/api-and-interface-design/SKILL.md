---
name: api-and-interface-design
description: "Designs APIs, module boundaries, public types, and events as stable contracts. Use when adding or changing an API, boundary, or event, or when two sides must be built in parallel."
---

# API and Interface Design

Design the contract before the implementation. Interfaces are forever more than you think. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

A new or changed API, module boundary, public type, or event. Also when two sides must be built in parallel.

## Principles

- **Hyrum's Law.** With enough users, every observable behavior becomes a dependency — including errors, ordering, and latency. Do not treat undocumented behavior as free to change.
- **One-version rule.** Prefer one live contract. Version publicly only when you must, and plan the removal (`deprecation-and-migration`).
- **Contract first.** Write the request, response, and errors before the handler. Consumers and tests bind to that, not to a guessed shape.
- **Consistent errors.** One error model. Callers should be able to branch on a stable code, not parse message text.
- **Validate at the boundary.** Untrusted input is checked where it enters. Internal code trusts the validated type.
- **Prefer addition.** New fields and endpoints over silent changes to existing ones. Removing or renaming is a breaking change.
- **Idempotency.** Mutations that clients may retry accept an idempotency key, or are naturally idempotent.
- **Pagination.** List endpoints are bounded. No unbounded "return everything".

Naming matches the codebase. Do not introduce a second style for one endpoint.

## Process

1. Name the callers and what they must not depend on.
2. Draft the contract: inputs, outputs, error codes, authz, idempotency, pagination.
3. Review it against Hyrum's Law: what will people couple to that you did not intend?
4. Record a breaking change as an ADR (`adr-writing`).
5. Implement against the contract. Tests assert the contract, not private helpers.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "We can change it, there is only one caller." | That caller will multiply, and the next one will copy the accidents. |
| "A string error is fine." | Callers will match on the sentence, and you will be unable to reword it. |
| "We'll paginate when it's slow." | Unbounded responses fail as data, not as design. |

## Red flags

- Breaking changes with no version or migration note.
- Validation only in the UI.
- Two error shapes in the same API.

## Verification

The contract is written down, boundary tests cover success and the error codes, and any breaking change has an ADR and a migration note.
