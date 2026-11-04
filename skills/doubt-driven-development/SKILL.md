---
name: doubt-driven-development
description: "Challenges risky or hard-to-undo decisions before committing to them. Use for auth, payments, migrations, deploys, data deletion, or unfamiliar code where a confident claim should be checked first."
---

# Doubt-Driven Development

Cross-examine every non-trivial decision in a fresh context before it stands. A confident answer is not a correct one.

This is not `/code-review`. Review judges a finished change. This runs in flight, while changing course is cheap.

## When to use

A decision that adds branching, crosses a boundary, or is hard to undo (auth, payments, migrations, deploys, data deletion). Also in unfamiliar code.

## When not to use

Renames, formatting, obvious one-line edits, or when the user asked for speed over verification.

## Loading

Run this from the main session. A persona must not spawn another persona for the doubt step. Inside a subagent, surface that it cannot nest.

## Cycle

1. **Claim.** The decision, and why it matters if it is wrong.
2. **Extract.** The artifact and the contract, without your reasoning.
3. **Doubt.** Ask a fresh-context reviewer to disprove the claim. Bias toward failure modes.
4. **Reconcile.** Classify each finding: accept, reject with a reason, or unclear.
5. **Stop** when findings are trivial, after three cycles, or when the user overrides with the risk named.

## Red flags

- Asking the same context to grade itself.
- Stopping after one agreeable review when the claim is irreversible.

## Verification

The claim, the reviewer's objections, and what you changed or accepted are visible to the user before you proceed.
