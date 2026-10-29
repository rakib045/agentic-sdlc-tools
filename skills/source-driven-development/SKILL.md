---
name: source-driven-development
description: "Verifies APIs, tool configuration, and framework conventions against this repo or current official docs before using them. Use before calling an API or library you have not confirmed."
---

# Source-Driven Development

Ground framework and library decisions in official documentation. Verify, cite, and flag what you did not verify. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

You are about to call an API, configure a tool, or follow a framework convention you have not confirmed in this repo or in current official docs.

## When not to use

The project already wraps the API and you are calling that wrapper as its tests describe. Still do not invent new wrapper behavior.

## Process

1. Prefer code and docs already in the repo over memory.
2. For external APIs, open the official documentation for the version this project uses. Cite the page or the versioned source.
3. Copy the smallest example that matches the version. Adapt it to local conventions. Do not mix major versions.
4. If you cannot verify a signature, option, or default, say **unverified** and do not present it as fact. Ask, or spike a tiny check.
5. Do not invent flags, config keys, or methods. A plausible name is not an API.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "I know this library." | Versions drift. Check the one in the lockfile. |
| "The example is probably still valid." | Probably is how broken upgrades ship. Cite it or mark it unverified. |

## Red flags

- APIs with no citation and no local usage.
- Advice for a framework the repo does not use.
- A config key you have not seen in the schema or the docs.

## Verification

Every non-obvious external call is either cited (official doc + version) or marked unverified. The project still builds.
