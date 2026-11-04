---
name: constraint-driven-development
description: "Establishes and enforces a written quality bar (CONSTRAINTS.md) when none exists or checks are being silenced. Use before /build auto or when setting project standards."
---

# Constraint-Driven Development

Write the project's quality bar down, with numbers and commands, so agents cannot quietly lower it.

## When to use

No `CONSTRAINTS.md` exists, the user asks to set standards, or an agent is silencing checks or skipping tests. Also before `/build auto`.

## When not to use

Constraints already exist: follow them. Throwaway spikes need the floor only. Do not interview in CI or an unattended loop. Apply the floor, say so, and flag the rest.

## Process

1. **Detect first.** Read the manifest, test runner, linters, coverage, and CI. Report in two lines.
2. **At most four questions**, one at a time, each with a default. "I don't know" must still yield a working config.
3. **Write `CONSTRAINTS.md`** at the repo root: Floor, enforced numbers with reasons, measured-only metrics with current values, and exceptions with owners and expiry dates.
4. **A number without a command is an aspiration.** Record the exact command beside each rule.
5. **Place checks by cost.** Types, lint, and secrets in the edit loop. Related tests at task end. The rest at review or in CI.
6. **Point agents at the file** from the project's rules. Never weaken a constraint to pass a change.
7. **Verify** by running the constraints on the current branch.

Sub-modes, if asked: `check` (run them), `guard` (diff for a lowered bar), `ratchet` (record today's values as the floor).

## Floor

Do not silence type or lint errors. Do not skip or delete tests. Do not leave stubs presented as done. Do not lower a threshold or add a suppression to get green.

## Red flags

- New ignore comments, skipped tests, deleted assertions, or a lowered threshold.
- A constraint with no command.

## Verification

`CONSTRAINTS.md` exists, every enforced rule has a command, and you ran those commands.
