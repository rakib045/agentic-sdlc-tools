---
name: interview-me
description: "Interviews the user one question at a time to uncover who, why, success criteria, and binding constraints. Use when a request is underspecified or the user says interview me, grill me, or are we sure."
---

# Interview Me

Extract what the user actually wants before any plan, spec, or code. One question at a time, until about 95% confidence.

## When to use

The ask is missing who it is for, why now, what success looks like, or the binding constraint. Also when the user says "interview me", "grill me", or "are we sure?".

## When not to use

Unambiguous mechanical edits, or a user who asked for speed. Never run this in CI or an unattended loop. Flag the gap instead of guessing.

## Process

1. Hypothesize, with a confidence number you can defend. Below ~70%, say what is missing.
2. Ask one question, with a guess:
   ```
   Q: <one focused question>
   GUESS: <your hypothesis and why>
   ```
   Wait for the answer. Never batch questions.
3. Reflect want vs should-want. "A dashboard" may mean "a number I can say in standup".
4. Stop near 95%. Then hand off to `idea-refine` or `spec-driven-development`.

## Verification

You can state the user, the job to be done, the success measure, and the constraint they confirmed, not the ones you invented.
