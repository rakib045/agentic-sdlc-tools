---
name: deprecation-and-migration
description: "Retires features, APIs, flags, or dependencies and moves callers to replacements. Use when sunsetting something, migrating callers, or deleting zombie code."
---

# Deprecation and Migration

Code is a liability. Remove old paths on purpose, with a migration, not by abandonment. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Sunsetting a feature, API, flag, or dependency; moving callers to a replacement; deleting zombie code.

## When not to use

You do not yet know what still calls the old path. Discover callers before announcing a removal.

## Process

1. Inventory callers, data, and docs. Chesterton's fence: if you cannot explain why it exists, do not delete it yet.
2. Choose the mode:
   - **Advisory** — still works, warns, has a replacement and a date.
   - **Compulsory** — the old path fails after the date, and every known caller has moved.
3. Ship the replacement first. Dual-run or adapt at the boundary if the cutover is risky.
4. Migrate callers in reviewable slices. Update docs and ADRs (`adr-writing`).
5. Remove the old path only when callers are gone or the compulsory date has passed and the breakage is intentional.
6. Feature flags need an expiry. A flag with no removal task is zombie code.

Do not leave two public contracts alive without an owner and a removal date (One-Version Rule, see `api-and-interface-design`).

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "Nothing imports it, I'll delete it." | Search dynamically loaded names, configs, and external clients first. |
| "Keep both forever." | Forever is how the wrong path becomes the one with users. |
| "Deprecate in a comment." | A comment is not a migration. Callers need a replacement and a date. |

## Red flags

- A removal diff with no caller search.
- A new API beside the old one and no plan to finish the move.
- Data migrated without a rollback or a dry run.

## Verification

Caller inventory, replacement, migration status, removal date or evidence the old path is unused, and tests that cover the new path.
