---
name: adr-writing
description: "Records expensive-to-reverse decisions as Architecture Decision Records. Use when choosing a framework, data model, auth approach, API style, hosting, or a public contract change."
---

# ADR Writing

Document the why: context, decision, alternatives. Code shows what was built.

## When to use

Expensive-to-reverse choices: framework, data model, auth, API style, hosting, or public contract change. Not obvious code or throwaway spikes.

## Match the repo first

Continue any existing ADR directory, numbering, and headings. If evidence conflicts, ask. Use the default only when no convention exists.

## Default template

Store in `docs/adr/NNNN-title.md`. Number sequentially. One page.

```markdown
# ADR-NNNN: Title

## Status
Proposed | Accepted | Superseded by ADR-XXXX | Deprecated

## Date
YYYY-MM-DD

## Context
Constraints that forced the decision.

## Decision
What we will do, in timeless language.

## Consequences
What becomes easier, harder, or risky.

## Alternatives considered
What we rejected, and why.
```

Link the ADR from `PLAN.md` when the plan depends on it.

## Red flags

- A second numbering scheme beside an existing one.
- A decision with no alternatives.
- Docs that describe the diff ("added X") instead of current behavior.

## Verification

The ADR is linked from the plan or change, status is set, and it matches the repo's format.
