---
name: shipping-and-launch
description: "Runs a safe production launch or risky migration with a go/no-go checklist, rollout plan, and rollback procedure. Use before significant user-facing releases or infrastructure migrations."
---

# Shipping and Launch

Deploy so you can reverse it, see it, and limit the blast radius. Deployment is not release.

## When to use

Production deploys, significant user-facing releases, data or infra migrations, or any risky launch. `/deploy` is the orchestrator; this skill is the checklist and decision.

## Pre-launch checklist

- **Code.** Tests, build, and lint green. Reviewed. No debug output or unresolved TODOs.
- **Security.** No secrets in the tree. No unaccepted critical/high dependency issues. Authz on protected actions.
- **Performance.** Budgets met where measured. Do not invent vitals (`performance-optimization`).
- **Accessibility.** If UI: keyboard, names, contrast, focus, errors tied to fields.
- **Infrastructure.** Env vars set, migrations have a down path, health check live, logs and error reporting on.
- **Docs.** Changelog, ADRs, user-facing notes if behavior changed.

## Flags and rollout

Ship risky behavior behind a default-off flag. Roll out in stages when the platform supports it. Set the flag's removal date (`deprecation-and-migration`).

## Decision

GO only when blockers are clear and a rollback plan exists: trigger, procedure, recovery target. A Critical finding from review, security, or tests is NO-GO unless the user explicitly accepts it.

## Red flags

- Publishing from a dirty tree or a red suite.
- A GO with no health check and no rollback trigger.
- Secrets in the release workflow file.

## Verification

Ship decision recorded, rollback procedure written, and, if released, the artifact and health check actually checked.
