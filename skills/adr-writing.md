# ADR Writing

Document the why. Code shows what was built; an ADR records the context, the decision, and the alternatives. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT). This skill is the kit's documentation-and-adrs workflow.

## When to use

A choice that would be expensive to reverse: framework, data model, auth, API style, hosting, or a public contract change. Also when shipping user-facing behavior that future agents will misread without context.

## When not to use

Obvious code. Do not comment what the code already says. Do not write ADRs for throwaway spikes.

## Match the repo first

Look for existing ADRs, an `.adr-dir`, or a documented format. Continue that directory, numbering, and headings. If evidence conflicts, ask. Only use the default below when no convention exists.

## Default template

Store in `docs/adr/NNNN-title.md`. Number sequentially. One page.

```markdown
# ADR-NNNN: Title

## Status
Proposed | Accepted | Superseded by ADR-XXXX | Deprecated

## Date
YYYY-MM-DD

## Context
What forced the decision. Constraints, not a diary of the change.

## Decision
What we will do, in timeless language (current state, not "we changed").

## Consequences
What becomes easier, harder, or risky.

## Alternatives considered
What we rejected, and why.
```

Link the ADR from `PLAN.md` when the plan depends on it.

## Other docs

- Public APIs: document the contract, errors, and authz — not a line-by-line tour.
- READMEs: setup and the commands a new agent must run. Keep them current when those commands change.
- Inline comments: only for constraints the code cannot express (why this looks wrong, what must not be reordered).

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "The PR description is enough." | PR text is not what the next session reads. Put the why next to the code. |
| "We'll document at the end." | The alternatives are forgotten by then. Write the ADR when the decision is made. |

## Red flags

- A second ADR numbering scheme beside an existing one.
- Decision with no alternatives.
- Docs that describe the diff ("added X") instead of the current behavior.

## Verification

The ADR is linked from the plan or the change description, status is set, and it matches the repo's existing format if one exists.
