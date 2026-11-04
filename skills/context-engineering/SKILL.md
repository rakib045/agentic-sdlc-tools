---
name: context-engineering
description: "Loads the right project context at session start, on task switch, or in a new repo. Use when answers get generic, ignore local conventions, or repeat questions the repo already answers."
---

# Context Engineering

Give the agent the right information at the right time. More context is not better context.

## When to use

Session start, task switch, a new repo, or when answers get generic or ignore local conventions.

## Process

1. Read the project rules and the spec for this slice. Do not load the whole tree.
2. Find the closest local pattern (sibling module, test, config) and match it.
3. Pack only what the slice needs: boundary types, the caller, the test command, `CONSTRAINTS.md` if present.
4. Drop stale context when the task changes.
5. Query the authoritative tool or MCP server instead of guessing.
6. When quality drops, reload the spec, the failing output, and the nearest example. Do not add files at random.

## Red flags

- Editing files you have not opened.
- Retrying the same edit without reading the error.

## Verification

Before writing the change, name the spec section, the local pattern you matched, and the command you will use to verify.
