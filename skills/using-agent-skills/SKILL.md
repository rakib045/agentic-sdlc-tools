---
name: using-agent-skills
description: "Routes a task to the right skill at session start or task switch. Use when unsure which workflow applies; if a skill might match, load it before implementing."
---

# Using Agent Skills

Discover which workflow applies, then follow it. This is the meta-skill. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Starting a session, switching tasks, or unsure which skill applies. If there is even a small chance a skill matches, load it before implementing.

## Routing

```
Don't know what they want?     → interview-me
Rough concept, need variants?  → idea-refine
New project or feature?        → spec-driven-development
No written quality bar?        → constraint-driven-development
Have a spec, need tasks?       → planning-and-task-breakdown
Implementing?                  → incremental-implementation
  UI?                          → frontend-ui-engineering
  API or boundary?             → api-and-interface-design
  Need doc-verified code?      → source-driven-development
  Stakes high / unfamiliar?    → doubt-driven-development
  Context thin or stale?       → context-engineering
Writing or running tests?      → test-driven-development
  Browser?                     → browser-testing-with-devtools
Something broke?               → debugging-and-error-recovery
Reviewing?                     → code-review-and-quality
  Too complex?                 → code-simplification
  Security?                    → security-and-hardening
  Performance?                 → performance-optimization
Committing or versioning?      → conventional-commits
CI/CD?                         → ci-cd-and-automation
Deprecating or migrating?      → deprecation-and-migration
Docs or ADRs?                  → adr-writing
Logs, metrics, alerts?         → observability-and-instrumentation
Deploying?                     → shipping-and-launch
```

## Rules

1. Skills are workflows, not suggestions. Follow the steps. Do not skip verification.
2. Several skills may apply in sequence. A feature is often spec → plan → implement → test → review → ship.
3. A bug is often debug → prove-it test → review.
4. When in doubt and the task is non-trivial, start with a spec.
5. Personas do not invoke other personas. Commands orchestrate. Skills may be loaded from either.

## Do not tell yourself

- "This is too small for a skill."
- "I can just implement it."
- "I'll gather context first and skip the workflow."

## Verification

You can name the skill you loaded and the exit evidence it requires. If you cannot, you have not applied it.
