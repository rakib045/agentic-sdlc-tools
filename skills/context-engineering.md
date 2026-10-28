# Context Engineering

Give the agent the right information at the right time. More context is not better context. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Session start, task switch, a new repository, or when answers get generic, ignore local conventions, or repeat questions the repo already answers.

## Process

1. Read the project's rules and the spec or task for this slice. Do not load the whole tree.
2. Find the local pattern closest to the change: a sibling module, a test, a config file. Match it.
3. Pack only what the slice needs: types at the boundary, the caller, the test command, and any constraint file (`CONSTRAINTS.md`).
4. Drop stale context when the task changes. Do not carry assumptions from the previous feature.
5. If a tool or MCP server is the authoritative source (issue tracker, browser, docs), query it instead of guessing from memory.
6. When quality drops — invented APIs, ignored conventions, repeated failed edits — stop and reload the spec, the failing output, and the nearest example. Do not add more files at random.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll read everything first." | Unfocused context crowds out the spec and the local pattern. |
| "I remember how this codebase works." | Re-read the files you will touch. Memory drifts. |

## Red flags

- Implementing before opening the files you will edit.
- A solution that does not match neighboring code and has no reason to differ.
- Retrying the same edit without reading the error.

## Verification

You can name the spec section, the local pattern you matched, and the command you will use to verify — before writing the change.
