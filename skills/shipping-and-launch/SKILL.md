---
name: shipping-and-launch
description: "Runs a safe production launch or risky migration with a go/no-go checklist, rollout plan, and rollback procedure. Use before significant user-facing releases or infrastructure migrations."
---

# Shipping and Launch

Deploy so you can reverse it, see it, and limit the blast radius. Deployment is not release. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

A production deploy, a significant user-facing release, a data or infra migration, or any launch with risk. `/deploy` is the orchestrator; this skill is the checklist and the decision.

## Pre-launch checklist

- **Code.** Tests, build, and lint green. Reviewed. No debug output, unresolved TODOs, or uncovered failure modes.
- **Security.** No secrets in the tree. Dependency audit clean of critical/high issues you have not accepted. Authz on protected actions. Headers and rate limits where the stack has them.
- **Performance.** Budgets met where measured. No new N+1 on critical paths. Do not invent vitals (`performance-optimization`).
- **Accessibility.** If there is UI: keyboard, names, contrast, focus, errors tied to fields.
- **Infrastructure.** Env vars set, migrations ready with a down path, health check live, logs and error reporting on.
- **Docs.** Changelog, ADRs for new decisions, user-facing notes if behavior changed.

## Flags and rollout

Ship incomplete or risky behavior behind a flag, default off. Roll out in stages (internal, small percent, full) when the platform supports it. Define the flag's removal date so it does not become zombie code (`deprecation-and-migration`).

## Decision

GO only when blockers are clear and a rollback plan exists: trigger, procedure, and a recovery target. A Critical finding from review, security, or tests is NO-GO unless the user explicitly accepts it.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "We can roll forward if it breaks." | Roll-forward is a hope. Write the rollback. |
| "The flag can default on." | Default on is a release, not a deploy. |
| "Monitoring can wait until after launch." | After launch is when you needed it. |

## Red flags

- Publishing from a dirty tree or a red suite.
- A GO with no health check and no rollback trigger.
- Secrets in the release workflow file.

## Verification

Ship decision recorded, specialist reports attached or summarized, rollback procedure written, and — if you released — the published artifact and health check actually checked.
