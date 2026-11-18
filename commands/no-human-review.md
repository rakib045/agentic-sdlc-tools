---
description: Modifier flag for /orches-sdlc and /orches-sdlc-jira. Pass it with the command to skip the build acceptance and the PR question, and create the PR automatically when a git host is connected. Spec and plan approval still need the user. Use for unattended delivery once the scope is clear.
agent: orchestrator
subagent: false
---

# /no-human-review — Autonomous Mode Flag

Add `/no-human-review` to one of these commands:

- `/orches-sdlc <feature description> /no-human-review`
- `/orches-sdlc-jira <PROJ-123 or URL> /no-human-review`

The flag can appear anywhere in the arguments. Match it case-insensitively. Open every reply with `🧭 orchestrator`.

## What changes

| Stage | With the flag |
|---|---|
| Spec (Stage 1) | Still needs your approval |
| Plan and plan review (Stage 2) | Still needs your agreement. Revisions repeat until you agree |
| Build and build review (Stages 3 and 4) | Unchanged. Unit tests, one commit per task, up to 3 review rounds |
| Build acceptance (Stage 5) | Automatic once every review approves. No confirmation |
| PR decision (Stage 7) | Automatic. Creates the PR if a git host is connected, without asking |

If no git host is connected, the title and description are shown and the run stops. Nothing is created.

## Still stops for you

- an ambiguous spec, or missing information on the Jira card;
- a failing test that cannot be fixed;
- a review still open after 3 rounds;
- a missing Atlassian connection, when using `/orches-sdlc-jira`;
- any irreversible step outside creating the PR.

It never merges, releases, or pushes to the default branch, even with the flag.

## If run on its own

If you run `/no-human-review` without a feature or Jira card, ask the user which one to run and whether it is a feature description or a Jira card. Then run that flow with the flag applied, following the stages of `/orches-sdlc` or `/orches-sdlc-jira`.
