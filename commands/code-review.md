# /code-review — Review the Change

Invoke `code-review-and-quality` in this session. Also invoke `security-and-hardening` on the security axis and `performance-optimization` on the performance axis. If the change works but is harder to maintain than it should be, invoke `code-simplification` after the verdict, in a separate pass that preserves behavior.

This command does not spawn personas. For a parallel fan-out before launch, use `/deploy`.

## Steps

1. Read the spec or task, then the tests, then the implementation.
2. Review the current diff (staged changes or recent commits) on five axes:
   - **Correctness** — matches the spec, edge cases handled, tests would catch a regression
   - **Readability** — clear names, shallow control flow, matches local conventions
   - **Architecture** — existing patterns, clean boundaries, abstraction earns its cost
   - **Security** — input validated, secrets safe, auth checked
   - **Performance** — no N+1, no unbounded work; web metrics only if measured
3. Note change size. About 100 changed lines is the target. About 1000 should be split. Refactors and features should not share one change.
4. Categorize every finding: Critical, Required, Optional, Nit. Cite `file:line` and a concrete fix for Critical and Required.
5. Check `CONSTRAINTS.md` if it exists. A lowered threshold, a new suppression, a skipped test, or a stub is a finding.
6. Verdict: Approve, Request changes, or Comment. Do not approve Critical issues, failing tests, or silenced checks.
7. Name at least one thing done well.

## Output

Review summary, findings by severity, verification story (tests, build, security), verdict.

## Rules

- Be specific and actionable. Uncertainty is stated, not papered over.
- Do not approve code you have not seen tests for.
