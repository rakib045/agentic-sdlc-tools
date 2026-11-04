---
name: deprecation-and-migration
description: "Retires features, APIs, flags, or dependencies and moves callers to replacements. Use when sunsetting something, migrating callers, or deleting zombie code."
---

# Deprecation and Migration

Code is a liability. Remove old paths on purpose, with a migration.

## When to use

Sunsetting a feature, API, flag, or dependency; moving callers to a replacement; deleting zombie code.

## When not to use

You do not yet know what still calls the old path. Discover callers first.

## Process

1. Inventory callers, data, and docs. If you cannot explain why the code exists, do not delete it.
2. Choose a mode:
   - **Advisory**: still works, warns, has a replacement and a date.
   - **Compulsory**: fails after the date, and every known caller has moved.
3. Ship the replacement first.
4. Migrate callers in reviewable slices. Update docs and ADRs (`adr-writing`).
5. Remove the old path only when callers are gone or the compulsory date has passed.
6. Feature flags need an expiry and a removal task.

Never leave two public contracts alive without an owner and a removal date.

## Red flags

- A removal with no caller search.
- A new API beside the old one with no plan to finish the move.

## Verification

Caller inventory, replacement, migration status, removal date or evidence the old path is unused, and tests covering the new path.
