---
description: Turns a bug, feature, or task description into a Jira-ready ticket. Runs spec with clarifying questions first, then creates the Jira issue through the Atlassian MCP server, or outputs the ticket text when Jira is not connected. Use to write a ticket before any build work starts.
agent: orchestrator
subagent: false
---

# /orches-create-jira — Create a Jira Ticket

Usage: `/orches-create-jira <bug|feature|task> <description>`

Open every reply with `🧭 orchestrator`. Show the status board (agent, stage, state) at each step.

Every line that names an agent uses that agent's icon:

| Icon | Agent |
|---|---|
| 🧭 | orchestrator |
| 📋 | product-owner |
| 🧪 | qa-engineer |

Status line formats:

- Delegation: `🧭 orchestrator → 📋 product-owner ⏳ writing the spec`
- Done: `📋 product-owner ✅ done`
- Waiting: `🧭 orchestrator ⏸ waiting for you: answer the questions above`

## Stage 0: Read the request

1. The first word must be the type: `bug`, `feature`, or `task`. It is not case sensitive. If it is missing or not one of these, ask the user which type it is, and stop.
2. The rest of the arguments is the description. If it is empty or too vague to write a title, ask for it, and stop.
3. Map the type to a Jira issue type: `bug` to Bug, `feature` to Story, `task` to Task. Check the names against the project's Jira tools, because projects can rename them.
4. Ignore `/no-human-review` when reading the description.

## Stage 1: Spec and clarifying questions

1. `product-owner` runs `/spec` with the description and asks the clarifying questions. Ask at most 5 questions at a time. Ask only what a testable ticket needs:
   - **bug:** steps to reproduce, actual output, expected output, environment, how often it happens, and how severe it is;
   - **feature:** who it is for, the user story, how success is measured, boundaries, and what is out of scope;
   - **task:** the outcome, the scope, and the definition of done.
2. **Stop** until the user answers. Ask the next batch if anything essential is still open.
3. Summarize the final spec and ask the user to confirm it before writing the ticket.

## Stage 2: Draft the ticket

Write the ticket for the type:

- **Bug:** title, description, steps to reproduce, actual output, expected output, environment, and acceptance criteria that prove the fix.
- **Feature:** title, description as a user story, acceptance criteria in Given/When/Then form, out of scope, and open questions.
- **Task:** title, description, the steps or checklist, and acceptance criteria or definition of done.

Add a diagram or flow wherever a process, sequence, or state change is involved, in Mermaid format. If none is needed, write "No diagram needed."

Never include secrets, credentials, or customer data in the ticket.

## Stage 3: Jira connection check

1. Check that the Atlassian MCP server is connected and that its Jira tools can create issues.
2. **If connected:**
   - Ask for the Jira project key if it is not known.
   - Show the draft and ask the user to confirm it. Stop until they do.
   - Create the issue with the issue type, title, and description.
   - Show the issue key and link.
3. **If not connected:** output the ticket as copy-paste markdown, with these sections: title, type, description, diagram or flow, steps, actual and expected output (bugs), acceptance criteria, and open questions. Tell the user they can connect the Atlassian MCP server to create the ticket directly. Stop.

## Rules

- Never create a ticket without confirmation, unless `/no-human-review` is set.
- One ticket per request.
- Every acceptance criterion must be testable.
- Keep open questions in the ticket, not hidden in the description.

## No-human-review mode

If the arguments include `/no-human-review`, this run is autonomous.

- Ask a question only when a title or testable acceptance criterion cannot be written without the answer. Turn every other open point into a stated assumption, and list the assumptions in the ticket under "Assumptions".
- Skip the spec confirmation and the draft confirmation.
- If Jira is connected, create the issue without asking and show the key and link.
- If Jira is not connected, output the ticket and stop.
- Never delete or change an existing Jira issue.
