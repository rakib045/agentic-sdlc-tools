# Doubt-Driven Development

Cross-examine every non-trivial decision in a fresh context before it stands. A confident answer is not a correct one. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

This is not `/code-review`. Review judges a finished change. This skill runs in flight, while changing course is still cheap.

## When to use

A decision that adds branching, crosses a boundary, asserts something the compiler cannot check, depends on hidden context, or is hard to undo (auth, payments, migrations, deploys, data deletion). Also when working in unfamiliar code, or when a confident claim would be cheaper to disprove now.

## When not to use

Renames, formatting, one-line obvious edits, reading code, or a user who asked for speed over verification. Do not doubt every keystroke.

## Loading

Run this from the main session. A persona must not spawn another persona to do Step 3. If you are already inside a subagent, surface that doubt-driven review cannot nest and let the main session run it.

## Cycle

1. **Claim.** Two or three lines: the decision, and why it matters if it is wrong.
2. **Extract.** The artifact and the contract, without your reasoning. The reviewer should not inherit your confidence.
3. **Doubt.** Ask a fresh-context reviewer to disprove the claim. Bias toward failure modes, not approval.
4. **Reconcile.** Classify each finding against the artifact: accept, reject with a reason, or unclear. Do not wave away a finding because you remember why you wrote it.
5. **Stop** when findings are trivial, you have done three cycles, or the user overrides with the risk named.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I already thought about that." | That is the context a fresh reviewer is there to escape. |
| "The types check." | Types do not prove idempotence, ordering, or authz. |
| "We'll catch it in QA." | QA will not catch a race you did not name. |

## Red flags

- Skipping extract and asking the same context to grade itself.
- A persona launching another persona for this cycle.
- Stopping after one agreeable review when the claim is irreversible.

## Verification

The claim, the reviewer's objections, and what you changed or explicitly accepted are visible to the user before you proceed.
