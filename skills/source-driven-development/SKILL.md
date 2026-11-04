---
name: source-driven-development
description: "Verifies APIs, tool configuration, and framework conventions against this repo or current official docs before using them. Use before calling an API or library you have not confirmed."
---

# Source-Driven Development

Ground framework and library decisions in official docs. Verify, cite, and flag what you did not verify.

## When to use

You are about to call an API, configure a tool, or follow a convention you have not confirmed in this repo or current official docs. Not when the project's wrapper is already tested and you call it as its tests describe.

## Process

1. Prefer code and docs already in the repo. Check the version in the lockfile.
2. For external APIs, open the official docs for the project's version. Cite the page.
3. Copy the smallest matching example. Do not mix major versions.
4. If you cannot verify a signature, option, or default, say **unverified**. Do not present it as fact.
5. Do not invent flags, config keys, or methods.

## Red flags

- APIs with no citation and no local usage.
- A config key you have not seen in the schema or docs.

## Verification

Every non-obvious external call is cited (doc + version) or marked unverified. The project still builds.
