---
description: Reads a Jira card by key or URL through the Atlassian MCP server, then runs the whole SDLC loop from that card. Spec, plan with review until the user agrees, build with unit tests and review, then an optional pull request. Use when the work is tracked in a Jira card.
agent: orchestrator
subagent: false
---

# /orches-sdlc-jira — Jira Card to Reviewed Code

Open every reply with `🧭 orchestrator`. Show the status board (agent, stage, state) at each step.

Every line that names an agent uses that agent's icon, so the user can see who is working:

| Icon | Agent |
|---|---|
| 🧭 | orchestrator |
| 📋 | product-owner |
| 📐 | solution-architect |
| 🎨 | senior-frontend-developer |
| 🔧 | senior-backend-developer |
| 🧪 | qa-engineer |
| 🔍 | code-reviewer |
| 🚀 | devops-engineer |

Status line formats:

- Delegation: `🧭 orchestrator → 📐 solution-architect ⏳ writing PLAN.md`
- Working: `🎨 senior-frontend-developer ⏳ task 3: login form tests`
- Done: `🎨 senior-frontend-developer ✅ done`
- Blocked: `🎨 senior-frontend-developer ⛔ blocked: <reason>`
- Review: `🔧 senior-backend-developer ⏳ reviewing task 3`

Delegate only to the sub-agents named below. Each brief must be complete: goal, files, acceptance criteria, boundaries, expected output, and the Jira card key. Sub-agents cannot see this conversation.

Automatic review rounds (agent to agent) run at most 3 rounds per gate. If issues remain after round 3, show them to the user and ask how to proceed. User gates have no round limit: the loop continues until the user agrees.

## No-human-review mode

If the arguments include `/no-human-review`, this run is autonomous. Ignore that flag when reading the Jira key.

- Spec approval (Stage 1) and plan agreement (Stage 2) still need the user. They are the only confirmations.
- Build acceptance (Stage 5) is automatic once every build review approves. The build is not presented for approval.
- The PR decision (Stage 7) is automatic. If a git host is connected, create the PR without asking. If not, show the title and description and stop.
- Still stop and ask for: a missing Atlassian connection, an ambiguous spec, a failing test that cannot be fixed, a review still open after 3 rounds, or any irreversible step outside creating the PR.
- Never merge, release, or push to the default branch, even in this mode.

## Stage 0: Read the Jira card

1. Check whether an Atlassian MCP server is connected and its Jira tools are available, such as a tool that reads an issue by key. If it is not connected, **stop**. Tell the user to connect the Atlassian MCP server first, then run `/orches-sdlc-jira` again. Do not continue.
2. Read the argument the user typed after the command. It is a Jira key such as `PROJ-123`, or a URL such as `https://<site>.atlassian.net/browse/PROJ-123`. Extract the key. If there is no key, ask for one and stop.
3. Read the card through the Atlassian MCP server: key, summary, type, status, description, acceptance criteria, comments, linked issues, and parent epic. If the card cannot be read, stop and show the error.
4. Show the user a short summary of the card. It is the request for Stage 1. Note anything missing as an open question.

## Stage 1: Spec

1. `product-owner` runs `/spec` with the card as the request: writes or updates `SPEC.md`. Each acceptance criterion from the card must appear in the spec.
2. **Stop.** Ask the user to approve the spec. Do not continue without an unambiguous yes.

## Stage 2: Plan and plan review

1. `solution-architect` runs `/plan`: writes `PLAN.md`. No product code.
2. `product-owner` reviews `PLAN.md` against `SPEC.md`. Check that every user story and acceptance criterion maps to a task, no task is out of scope, dependencies and order are right, and risks are flagged. Report `approve` or a numbered list of required changes, each with its task.
3. If the review finds changes, `solution-architect` revises `PLAN.md`, and the review repeats (up to 3 automatic rounds).
4. **Stop.** Show the reviewed plan and ask the user: agree, or request changes.
5. If the user requests changes, `solution-architect` revises `PLAN.md` with them, then go back to step 2. Repeat until the user agrees. Do not move on without agreement.

## Stage 3: Build

On plan agreement:

1. Route each task by layer. Frontend task: `senior-frontend-developer` builds it. Backend task: `senior-backend-developer` builds it. Split mixed tasks into one frontend slice and one backend slice.
   - Start every task whose dependencies are done. If a frontend task and a backend task are both ready, run them at the same time.
   - Two tasks that touch the same file never run together.
2. Run the tasks in dependency order. For each task, the developer writes the failing unit tests first (RED), then the minimal code to pass (GREEN), then runs the full suite and build. Unit tests are part of every task, not a later step.
3. One commit per task, staging only that task's files. Never `git add -A`.
4. Each developer owns its files. Never let two agents edit the same file at once.

## Stage 4: Build review

1. Each finished task is reviewed by another agent of the same role, not the one that built it. Frontend task: another `senior-frontend-developer` reviews it. Backend task: another `senior-backend-developer` reviews it.
2. The reviewer checks correctness against the acceptance criteria, unit test quality and coverage of the new behavior, boundaries, security, and dead code. It reports `approve` or numbered findings with file and line.
3. If the review finds issues, the builder fixes them and the reviewer checks again (up to 3 automatic rounds).

## Stage 5: Confirm the build

1. Show the build summary: tasks done, unit tests added, review verdicts, and the real output of the test and build commands.
2. **Stop.** Ask the user: accept the build, or request changes. In no-human-review mode, skip this stop once every review approved, and go to Stage 6.
3. If the user requests changes during build or at this confirmation, record each change as unchecked tasks in `PLAN.md`, then repeat Stages 3 to 5 for those tasks. The same build cycle applies: developers, unit tests, review, and confirmation.
4. If the user accepts, go to Stage 6.

## Stage 6: Pull request description

1. Write the PR title and body from `SPEC.md`, `PLAN.md`, the Jira card, and the commits on this branch. The title starts with the Jira key, for example `PROJ-123: <summary>`.
2. The body covers: Jira link and key, summary, what changed by layer, the acceptance criteria and how each was verified, unit tests added, review outcome, known limitations, and open questions.
3. Keep the title and description ready for Stage 7.

## Stage 7: Git check and pull request

1. Check whether the project is connected to a git host. Connected means a git remote on GitHub, GitLab, or Azure DevOps, or a connected MCP server for one of them.
2. If it is not connected, show the title and description, say the project is not connected to GitHub, GitLab, or Azure DevOps, and stop.
3. If it is connected, **stop** and ask the user: create a pull request? yes or no. In no-human-review mode, skip the question and answer yes.
4. If no, do not create a PR. Show the title and description and stop.
5. If yes, `devops-engineer` 🚀 creates a branch from the current work, named after the Jira key, commits any remaining changes (only this feature's files, never `git add -A`), pushes the branch, and opens the PR with the title and description. It never merges and never pushes to the default branch.
6. Show the PR link and the real command output.

## Rules

- Never skip a gate: spec approval, plan agreement, build acceptance, and the PR decision each need the user.
- Stop and ask on an ambiguous spec, a failing test that cannot be fixed, or any irreversible step.
- Verify by execution. Report real output, not claims.
- No scope creep, secrets, dead code, or skipped tests.
