---
name: interview-me
description: "Interviews the user one question at a time to uncover who, why, success criteria, and binding constraints. Use when a request is underspecified or the user says interview me, grill me, or are we sure."
---

# Interview Me

Extract what the user actually wants before any plan, spec, or code. One question at a time, until about 95% confidence. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

The ask is missing who it is for, why now, what success looks like, or the binding constraint. Also when the user says "interview me", "grill me", or "are we sure?".

## When not to use

Unambiguous mechanical edits, pure questions, or a user who has explicitly asked for speed over verification. Do not run this in CI or an unattended loop — flag the gap instead of guessing.

## Process

1. **Hypothesize.** One sentence plus a confidence number you can defend. Below ~70%, say what is still missing.
2. **Ask one question, with a guess.**
   ```
   Q: <one focused question>
   GUESS: <your hypothesis and why>
   ```
   Wait for the answer. Do not batch questions. The next question often depends on this one.
3. **Listen for want vs should-want.** "A dashboard" may mean "a number I can say in standup". Reflect that back.
4. **Update confidence in the open.** Stop near 95%, when you can predict the next answers. Then hand off to `idea-refine` or `spec-driven-development`.

Attach a guess so the user can react to a wrong hypothesis faster than they can invent an answer. Be willing to be wrong.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I'll assume and correct later." | Wrong assumptions get locked in once code exists. |
| "Asking five questions is more efficient." | The third question depends on the first. Batches get skimmed. |
| "They said dashboard, so they want a dashboard." | The convention is not the requirement. |

## Red flags

- A batch of questions in one message.
- Confidence stated without the missing pieces.
- Starting `SPEC.md` before the user has reacted.

## Verification

You can state the user, the job to be done, the success measure, and the constraint they confirmed — not the ones you invented.
