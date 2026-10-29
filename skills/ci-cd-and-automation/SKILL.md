---
name: ci-cd-and-automation
description: "Builds and fixes build, test, and deploy automation so CI failures reach the person who can fix them. Use when adding or changing pipelines or when CI feedback is lost."
---

# CI/CD and Automation

Shift checks left. Faster feedback is safer. A pipeline that cannot fail a bad change is not a pipeline. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Adding or changing build, test, or deploy automation, or when failures in CI are not reaching the person who can fix them.

## Quality gates

Order by cost:

1. Format, lint, typecheck, secret scan — seconds, in the edit loop.
2. Focused tests for the change — at the end of the task.
3. Full suite, dependency audit, build — in CI, on every change to the main line.
4. Deploy only after those gates pass. Production from a green, reviewed revision.

Record the exact command for each gate. A gate with no command is decoration.

## Practices

- **Trunk stays deployable.** Short-lived branches. Incomplete work uses flags (`shipping-and-launch`), not a long-lived integration branch.
- **Preview environments** for changes that need a human to click, when the host supports them.
- **Staged rollout** over big-bang when the blast radius is large.
- **Failure loop.** CI failures should come back as the log excerpt and the command to rerun, not as a red badge nobody opens.
- **Dependency updates** automated, with the same test gate as human changes.
- **Secrets** from the host's secret store. Never echoed in logs.

## Optimization

Cache dependencies. Do not cache your way around a broken test. Split a slow suite only when you still run the slow part before release.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "CI is red for an unrelated reason." | Main is not deployable until you know that. Fix or revert. |
| "We'll add the workflow later." | Later means the next bad change ships. |
| "Allow failure so the pipeline stays green." | A permitted failure is a disabled gate. |

## Red flags

- `continue-on-error` on tests or audits.
- Deploy jobs that run without the test job.
- Tokens printed in logs or committed in workflow files.

## Verification

The workflow file, the commands it runs, and a recent run (or a dry explanation of what would run) that shows failure actually blocks release.
