# Global Rules (language-agnostic)

These rules apply to every change, regardless of stack. Practices are adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT). Skills are workflows — follow them in order. Do not skip verification.

## Operating behaviors

1. **Surface assumptions.** Before non-trivial work, state what you are assuming about requirements, architecture, and scope. Ask to be corrected. Do not silently fill gaps.
2. **Stop when confused.** If the spec, code, and request disagree, name the conflict and wait. Do not guess.
3. **Push back.** If an approach has a concrete downside, say so, quantify it when you can, and propose an alternative. Accept an informed override.
4. **Prefer boring.** The simplest thing that meets the spec wins. Cleverness and speculative abstraction are failures.
5. **Surgical scope.** Touch only what the task requires. Do not clean up, delete, or modernize code you do not understand. Note out-of-scope issues; do not fix them in the same change.
6. **Verify, don't assume.** "Seems right" is not done. Evidence is a failing-then-passing test, a green build, or runtime output. Report the real output.

## Lifecycle

```
/spec → /plan → /build → /test → /code-review → /deploy
```

Load the matching skill before acting, even for a small change, unless the request is a typo, rename, or pure question.

| Intent | Skill |
|---|---|
| Underspecified ask, "interview me" | `interview-me` |
| Rough concept, need options | `idea-refine` |
| Define what to build | `spec-driven-development` |
| No written quality bar | `constraint-driven-development` |
| Have a spec, need tasks | `planning-and-task-breakdown` |
| Implement | `incremental-implementation` + `test-driven-development` |
| UI | `frontend-ui-engineering` |
| API or module boundary | `api-and-interface-design` |
| Framework or library API | `source-driven-development` |
| High-stakes or unfamiliar code | `doubt-driven-development` |
| Context is thin or stale | `context-engineering` |
| Something broke | `debugging-and-error-recovery` |
| Browser runtime | `browser-testing-with-devtools` |
| Review before merge | `code-review-and-quality` |
| Harder to read than it should be | `code-simplification` |
| Untrusted input, auth, secrets | `security-and-hardening` |
| Performance, including web vitals | `performance-optimization` |
| Commit, branch, version | `conventional-commits` |
| Pipeline or automation | `ci-cd-and-automation` |
| Retire or migrate | `deprecation-and-migration` |
| Decision or public API docs | `adr-writing` |
| Logs, metrics, traces, alerts | `observability-and-instrumentation` |
| Production launch | `shipping-and-launch` |
| Which skill applies | `using-agent-skills` |

## Artifacts

- Spec: `SPEC.md` (or `docs/spec.md`). Not a README.
- Plan: `PLAN.md` (or `docs/plan.md`). Include the ordered task list in that file.
- Quality bar, when set: `CONSTRAINTS.md`. Never weaken it to get green.
- Decisions: ADRs under the project's existing convention, else `docs/adr/NNNN-title.md`.

Do not overwrite an incomplete spec or plan for different work. Stop and ask.

## Definition of done

Acceptance criteria answer "did we build this thing?". The definition of done answers "is it ready?" and applies to every change:

- Acceptance criteria met, including edge and error paths.
- New behavior has a test that failed before the change and passes after it.
- Existing tests, build, and lint still pass. Report the output.
- No dead code, debug output, secrets, or unfinished stubs.
- Public behavior and irreversible decisions are documented.
- Risky changes have a rollback path. A human approves before merge or deploy.

## Anti-rationalization

These are incorrect. Ignore them.

- "This is too small for a skill / spec / test."
- "I'll add tests later."
- "It compiles, so it works."
- "I'll silence the check and fix it next."
- "I can clean this up while I'm here."

## Composition

Personas do not invoke other personas. The user or a slash command orchestrates. A persona may load skills. Parallel review belongs to `/deploy`, which launches the reviewers itself.

## Severity

Every persona, command, and review uses these labels:

- **Critical**: blocks merge or release. Vulnerability, data loss, broken behavior.
- **Required**: must fix before merge. Missing test, wrong boundary, poor errors, exploitable issue with conditions.
- **Optional**: worth doing, not required.
- **Nit**: author may ignore. Style or naming preference.

## Baseline

- Validate inputs at trust boundaries. Enforce auth on every protected action. Never log or commit secrets.
- Commits: `type: subject` — `feat|fix|docs|chore|refactor|test|build|ci`. Imperative, under 72 characters, one logical change.
- Findings cite `file:line`, severity, and a concrete fix. Approve only when tests pass and critical issues are gone.
