# Review Checklist

Short gate for `/code-review` and the code-reviewer persona. The full workflow is `code-review-and-quality`. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## Before a verdict

- [ ] Spec or task read. Tests read before implementation.
- [ ] Correctness: behavior matches the spec, including edges and errors.
- [ ] Tests prove behavior. A mutation of the new logic would fail them.
- [ ] Readability: names and structure match the codebase.
- [ ] Architecture: boundaries hold, or a new pattern is recorded.
- [ ] Security: input validated, authz checked, no secrets in code or logs.
- [ ] Performance: no N+1 or unbounded work. Web vitals not invented.
- [ ] Diff size is reviewable (~100 lines target). Refactor is not mixed with feature work.
- [ ] `CONSTRAINTS.md` not weakened: no new suppressions, skipped tests, or lowered thresholds.
- [ ] Build and tests actually run, or the gap is stated.

## Labels

- **Critical** — blocks merge.
- **Required** — fix before merge.
- **Optional** — worth doing.
- **Nit** — author may ignore.

Every Critical and Required item has `file:line` and a concrete fix. Include one specific thing done well.

Approve only when Critical is empty and tests pass.
