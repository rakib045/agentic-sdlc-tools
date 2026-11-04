---
name: idea-refine
description: "Turns a rough concept into a concrete direction by generating and comparing plausible shapes. Use when there is an idea but no decision yet, before spec-driven-development."
---

# Idea Refine

Turn a rough concept into a concrete proposal through divergent, then convergent, thinking.

## When to use

There is a concept but no decision: several plausible shapes, an unclear audience, or a solution looking for a problem. Use after `interview-me` if intent is still broad, and before `spec-driven-development`.

## When not to use

The requirement is already specific, or the user asked for a spec or code now.

## Process

1. Restate the problem in one sentence, separate from any solution.
2. **Diverge.** Produce at least three distinct approaches. Vary the user, constraint, or mechanism, not the wording.
3. Name the criteria that matter for this decision.
4. **Converge.** Score the options. Kill options that fail a hard constraint. Recommend one.
5. State what you are not building. Hand the recommendation to the user before writing a spec.

## Red flags

- Options that are the same design with different names.
- A recommendation with no killed alternatives.

## Verification

The user has accepted one option or asked to proceed with a named alternative. The rejected options and why are recorded in the spec or plan.
