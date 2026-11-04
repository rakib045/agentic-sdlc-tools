---
name: using-agent-skills
description: "Routes a task to the right skill at session start or task switch. Use when unsure which workflow applies; if a skill might match, load it before implementing."
---

# Using Agent Skills

Discover which workflow applies, then follow it.

## When to use

Starting a session, switching tasks, or unsure which skill applies. If a skill might match, load it first.

## Routing

```
Unclear request?          → interview-me
Rough concept?            → idea-refine
New project or feature?   → spec-driven-development
No quality bar?           → constraint-driven-development
Have spec, need tasks?    → planning-and-task-breakdown
Implementing?             → incremental-implementation
  UI?                     → frontend-ui-engineering
  API or boundary?        → api-and-interface-design
  Needs doc-verified code?→ source-driven-development
  High stakes?            → doubt-driven-development
  Stale context?          → context-engineering
Tests?                    → test-driven-development
  Browser?                → browser-testing-with-devtools
Something broke?          → debugging-and-error-recovery
Reviewing?                → code-review-and-quality
  Too complex?            → code-simplification
  Security?               → security-and-hardening
  Performance?            → performance-optimization
Committing?               → conventional-commits
CI/CD?                    → ci-cd-and-automation
Deprecating/migrating?    → deprecation-and-migration
Docs or ADRs?             → adr-writing
Logs, metrics, alerts?    → observability-and-instrumentation
Deploying?                → shipping-and-launch
```

## Rules

1. Skills are workflows. Follow the steps. Do not skip verification.
2. Several skills may apply in sequence: spec → plan → implement → test → review → ship.
3. When in doubt on a non-trivial task, start with a spec.
4. Only the orchestrator delegates to other agents.

## Verification

You can name the skill you loaded and the exit evidence it requires.
