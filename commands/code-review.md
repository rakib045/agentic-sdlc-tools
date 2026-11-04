---
description: Reviews the current diff on five axes and returns a severity-labeled verdict. Use before merging a change or when asked to review a diff or PR.
agent: code-reviewer
subagent: false
---

# /code-review — Review the Change

Invoke `code-review-and-quality`. Also invoke `security-and-hardening` for security and `performance-optimization` for performance. If the change works but is hard to maintain, invoke `code-simplification` after the verdict.

Does not spawn personas. For a parallel fan-out before launch, use `/deploy`.

## Steps

1. Read the spec or task, the tests, then the implementation.
2. Review the diff on five axes: **Correctness**, **Readability**, **Architecture**, **Security**, **Performance**.
3. Note change size. About 100 changed lines is the target; about 1000 must be split.
4. Label every finding Critical, Required, Optional, or Nit. Cite `file:line` and a concrete fix for Critical and Required.
5. Check `CONSTRAINTS.md` if present. A lowered threshold, suppression, or skipped test is a finding.
6. Verdict: Approve, Request changes, or Comment.
7. Name at least one thing done well.

## Output

Review summary, findings by severity, verification story, verdict.

## Rules

- Be specific and actionable. State uncertainty.
- Do not approve Critical issues, failing tests, silenced checks, or code you have not seen tests for.
