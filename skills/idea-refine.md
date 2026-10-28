# Idea Refine

Turn a rough concept into a concrete proposal through divergent, then convergent, thinking. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

There is a concept, but not yet a decision: several plausible shapes, an unclear audience, or a solution looking for a problem. Use after `interview-me` if intent is still broad, and before `spec-driven-development`.

## When not to use

The requirement is already specific, or the user asked for a spec or code now.

## Process

1. Restate the problem in one sentence, separate from any proposed solution.
2. **Diverge.** Produce at least three distinct approaches. Vary the user, the constraint, or the mechanism — not the wording.
3. Name the criteria that matter for this decision (user value, reversibility, operability, cost, time). Do not use a generic scorecard if the real constraint is one of those.
4. **Converge.** Score the options against those criteria. Kill the ones that fail a hard constraint. Recommend one.
5. State what you are not building. Hand the recommendation to the user before writing a spec.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "The first idea is fine." | The first idea is usually the conventional one, not the fit. |
| "More options will confuse them." | Three options with a recommendation is a decision, not a dump. |

## Red flags

- Options that are the same design with different names.
- A recommendation with no killed alternatives.
- Jumping to file structure before the problem is stable.

## Verification

The user has accepted one option, or explicitly asked to proceed with a named alternative. The rejected options and why are recorded in the spec or plan.
