---
name: ci-cd-and-automation
description: "Builds and fixes build, test, and deploy automation so CI failures reach the person who can fix them. Use when adding or changing pipelines or when CI feedback is lost."
---

# CI/CD and Automation

Shift checks left. A pipeline that cannot fail a bad change is not a pipeline.

## When to use

Adding or changing build, test, or deploy automation, or when CI failures are not reaching the person who can fix them.

## Quality gates

Order by cost. Record the exact command for each gate:

1. Format, lint, typecheck, secret scan: in the edit loop.
2. Focused tests for the change: at task end.
3. Full suite, dependency audit, build: in CI on every change to the main line.
4. Deploy only after those gates pass, from a green, reviewed revision.

## Practices

- Keep the trunk deployable. Use short-lived branches and flags for incomplete work (`shipping-and-launch`).
- Send failures back as the log excerpt and the rerun command.
- Automate dependency updates behind the same test gate.
- Read secrets from the host's secret store. Never log them.
- Cache dependencies. Do not cache around a broken test.

## Red flags

- `continue-on-error` on tests or audits.
- Deploy jobs that run without the test job.
- Tokens in logs or workflow files.

## Verification

The workflow file, the commands it runs, and a recent run (or dry explanation) that shows failure blocks release.
