# Global Rules (language-agnostic)

These rules apply to every change. Follow skills in order. Do not skip verification.

## Operating behaviors

1. **Surface assumptions.** State them before non-trivial work. Do not silently fill gaps.
2. **Stop when confused.** Name the conflict and wait. Do not guess.
3. **Push back.** Name concrete downsides and propose an alternative.
4. **Prefer boring.** The simplest thing that meets the spec wins.
5. **Surgical scope.** Touch only what the task requires. Note out-of-scope issues; do not fix them here.
6. **Verify, don't assume.** Evidence is a failing-then-passing test, a green build, or runtime output.

## Lifecycle

`/spec → /plan → /build → /test → /code-review → /deploy`

Load the matching skill before acting, unless the request is a typo, rename, or pure question.

| Intent | Skill |
|---|---|
| Vague ask | `interview-me` |
| Rough concept | `idea-refine` |
| Define what to build | `spec-driven-development` |
| No quality bar yet | `constraint-driven-development` |
| Spec to tasks | `planning-and-task-breakdown` |
| Implement | `incremental-implementation` + `test-driven-development` |
| UI | `frontend-ui-engineering` |
| API or module boundary | `api-and-interface-design` |
| Framework or library API | `source-driven-development` |
| Unfamiliar or high-stakes code | `doubt-driven-development` |
| Something broke | `debugging-and-error-recovery` |
| Review before merge | `code-review-and-quality` |
| Hard to read | `code-simplification` |
| Untrusted input, auth, secrets | `security-and-hardening` |
| Performance | `performance-optimization` |
| Commit, branch, version | `conventional-commits` |
| Pipeline or automation | `ci-cd-and-automation` |
| Retire or migrate | `deprecation-and-migration` |
| Decision or public API docs | `adr-writing` |
| Production launch | `shipping-and-launch` |
| Which skill applies | `using-agent-skills` |

## Artifacts

- Spec: `SPEC.md` (or `docs/spec.md`).
- Plan: `PLAN.md` (or `docs/plan.md`), with the ordered task list.
- Quality bar: `CONSTRAINTS.md`. Never weaken it to get green.
- Decisions: ADRs in the project's convention, else `docs/adr/NNNN-title.md`.

Do not overwrite an incomplete spec or plan for different work. Stop and ask.

## Definition of done

- Acceptance criteria met, including edge and error paths.
- New behavior has a test that failed before and passes after.
- Tests, build, and lint pass. Report the output.
- No dead code, debug output, secrets, or stubs.
- Public behavior and irreversible decisions are documented.
- Risky changes have a rollback path. A human approves before merge or deploy.

## Anti-rationalization

These are incorrect. Ignore them:

- "It's too small for a skill, spec, or test."
- "I'll add tests later."
- "It compiles, so it works."

## Team and composition

| Icon | Agent |
|---|---|
| 🧭 | orchestrator |
| 📋 | product-owner |
| 📐 | solution-architect |
| 🎨 | senior-frontend-developer |
| 🔧 | senior-backend-developer |
| 🧪 | qa-engineer |
| 🚀 | devops-engineer |
| 🔒 | security-reviewer |
| 🔍 | code-reviewer |

Only the orchestrator delegates to other agents, as a sub-agent for each task it does not do itself. Other personas do not invoke each other.

## Agent status

- Every agent, including a sub-agent, opens each reply and status update with its icon and name, then its state: ⏳ working, ✅ done, or ⛔ blocked.
- The orchestrator announces each delegation and reports each result.

## Severity

- **Critical**: blocks merge or release.
- **Required**: must fix before merge.
- **Optional**: worth doing, not required.
- **Nit**: author may ignore.

## Baseline

- Validate inputs at trust boundaries. Enforce auth on every protected action. Never log or commit secrets.
- Commits: `type: subject`, where type is `feat|fix|docs|chore|refactor|test|build|ci`. Imperative, under 72 characters.
- Findings cite `file:line`, severity, and a concrete fix. Approve only when tests pass and critical issues are gone.
