# Constraint-Driven Development

Write this project's quality bar down, with numbers and commands, so agents cannot quietly lower it. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

Spec says what to build. Tests prove it works. Constraints say what "good enough" means before anyone argues in review.

## When to use

No `CONSTRAINTS.md` exists, the user asks to set standards, or an agent is silencing checks, skipping tests, or producing more code than anyone will read. Also before `/build auto`.

## When not to use

Constraints already exist and the user is not changing them — read and follow them. Throwaway spikes need the floor only.

Do not interview in CI or an unattended loop. Apply the floor, say that you did, and flag the rest.

## Process

1. **Detect before asking.** Read the manifest, test runner, linters, coverage, and CI. Report what you found in two lines.
2. **At most four questions, one at a time, each with a default.** Dimensions beyond the floor, block vs warn, target numbers vs today's measured floor, and the slowest check tolerated before handing work back. "I don't know" must still produce a working config.
3. **Write `CONSTRAINTS.md`** at the repo root: a Floor section, enforced numbers with reasons, measured-only metrics with today's values, and an exceptions table with owners and expiry dates.
4. **A number without a command is an aspiration.** Record the exact command next to each rule. Prefer tools already in the repo. Accessibility and performance need a running URL; if there is none, drop that dimension instead of inventing a check.
5. **Place checks by cost.** Types, lint, and secrets in the edit loop. Related tests and changed-line coverage at task end. Everything else at review or in CI. Scope checks to the diff when the tool allows it.
6. **Point agents at the file** from the project's rules. Never weaken a constraint to make a change pass.
7. **Verify** by running the constraints on the current branch. If the user rejects a failure, fix the constraint now rather than leaving a gate people will ignore.

Sub-modes, if asked: `check` (run them), `guard` (diff for a lowered bar), `ratchet` (record today's values as the floor).

## Floor

Do not silence type or lint errors. Do not skip or delete tests. Do not leave unimplemented stubs as if they were done. Do not lower a threshold or add a suppression to get green.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "The warning is noisy." | Fix the code or change the constraint with the user. Do not suppress it in the diff. |
| "Coverage can wait." | A bar decided per PR is not a bar. |

## Red flags

- New ignore comments, skipped tests, deleted assertions, or a threshold edited down.
- A constraint with no command.
- Exceptions with no owner or expiry.

## Verification

`CONSTRAINTS.md` exists, every enforced rule has a command, and you have run those commands and reported the output.
