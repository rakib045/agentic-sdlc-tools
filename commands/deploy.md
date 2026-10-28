# /deploy — Release Safely

Invoke `shipping-and-launch`. This command is the launch orchestrator: parallel review, then a go/no-go, then the release steps. Personas do not call each other. You merge their reports.

Skip the fan-out only when all of these are true: 2 files or fewer, under 50 changed lines, and no auth, payments, data access, or config/env. Otherwise fan out.

## Phase A — Parallel review

Spawn these personas in one turn so they run concurrently. If subagents are unavailable, run them sequentially and still merge.

1. `code-reviewer` — five-axis review of the change.
2. `security-reviewer` — trust boundaries, OWASP, secrets, auth, dependencies.
3. `qa-engineer` — coverage gaps: happy path, edges, errors, concurrency.

Each returns only its report. They do not delegate to each other.

## Phase B — Merge

1. Code quality — Critical/Required findings, plus failing test, lint, or build output.
2. Security — promote Critical/High to launch blockers.
3. Performance — from the review's performance axis. Do not invent Core Web Vitals.
4. Accessibility — keyboard, names, contrast, focus, if the change has UI.
5. Infrastructure — env vars, migrations, health checks, flags, monitoring (`observability-and-instrumentation`, `ci-cd-and-automation`).
6. Documentation — README, ADRs, changelog (`adr-writing`).

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

1. Confirm the tree is clean and the suite is green.
2. Bump the semantic version, update the changelog, tag the release (`conventional-commits`).
3. Run CI (build, test, lint, dependency audit). Publish only from that result.
4. Verify the published artifact and the health check. Watch the rollback triggers.

## Rules

- Never publish from a dirty tree or a red suite.
- Secrets via the environment or a secret store only.
- Decouple deploy from release with flags when the blast radius is non-trivial.
