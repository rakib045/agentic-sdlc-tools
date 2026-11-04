---
description: Runs parallel review, a go/no-go decision, and a versioned release with a rollback plan. Use before shipping to production or cutting a release.
agent: devops-engineer
subagent: false
---

# /deploy — Release Safely

Invoke `shipping-and-launch`. This command launches parallel review, decides go/no-go, then releases. Reviewers do not delegate to each other. You merge their reports.

Skip the fan-out only when all are true: 2 files or fewer, under 50 changed lines, and no auth, payments, data access, or config/env changes.

## Phase A — Parallel review

Spawn in one turn. If subagents are unavailable, run in sequence.

1. `code-reviewer` — five-axis review.
2. `security-reviewer` — trust boundaries, OWASP, secrets, auth, dependencies.
3. `qa-engineer` — coverage gaps.

## Phase B — Merge

1. Code quality — Critical/Required findings, plus test, lint, and build output.
2. Security — promote Critical/High to launch blockers.
3. Performance, accessibility, infrastructure (env vars, migrations, health checks, flags, monitoring), and documentation.

## Phase C — Decision

```markdown
## Ship Decision: GO | NO-GO
### Blockers
### Recommended fixes
### Acknowledged risks
### Rollback plan
- Trigger:
- Procedure:
- Recovery target:
### Specialist reports
```

A Critical finding means NO-GO unless the user explicitly accepts the risk. A GO without a rollback plan is not a GO.

## Phase D — Release (only after GO)

1. Confirm a clean tree and green suite.
2. Bump the version, update the changelog, and tag (`conventional-commits`).
3. Run CI. Publish only from that result. Verify the artifact and health check.

## Rules

- Never publish from a dirty tree or a red suite.
- Secrets via the environment or a secret store only.
- Decouple deploy from release with flags when the blast radius is non-trivial.
