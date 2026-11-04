---
name: review-checklist
description: "Short pre-verdict checklist for code review covering spec, tests, correctness, security, and readability. Use as the final gate before approving or requesting changes."
---

# Review Checklist

Short gate for `/code-review` and the code-reviewer persona. The full workflow is `code-review-and-quality`.

## Before a verdict

- [ ] Spec read. Tests read before implementation.
- [ ] Correctness: matches the spec, including edges and errors.
- [ ] Tests prove behavior.
- [ ] Security: input validated, no secrets in code or logs.
- [ ] No N+1 or unbounded work. Diff reviewable (~100 lines).
- [ ] `CONSTRAINTS.md` not weakened. Build and tests actually ran.

## Labels

**Critical** blocks merge. **Required** must be fixed. **Optional** and **Nit** are non-blocking.

Every Critical and Required item has `file:line` and a fix. Approve only when Critical is empty and tests pass.
