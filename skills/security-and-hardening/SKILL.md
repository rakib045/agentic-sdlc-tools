---
name: security-and-hardening
description: "Hardens code that handles untrusted input, auth, sessions, sensitive data, uploads, webhooks, payments, PII, new dependencies, or AI tool calls. Use for any security-relevant change."
---

# Security and Hardening

Treat every external input as hostile, every secret as sacred, and every authorization check as mandatory. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

Untrusted input, auth, sessions, storage of sensitive data, file uploads, webhooks, payments, PII, new dependencies, or AI features that can call tools.

## Process

1. **Map trust boundaries.** HTTP, forms, uploads, webhooks, queues, third-party APIs, model output, and local values another process could have written. Trust follows who wrote the value, not which channel delivered it.
2. **Name the assets.** Credentials, PII, payment data, admin actions, money movement.
3. **STRIDE each boundary.** Spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege. Write the abuse case next to the use case.
4. If you cannot name the boundaries, you are not ready to secure the feature.

## Three-tier boundary

**Always:** validate at the boundary; parameterize queries; encode output; HTTPS; strong password hashing; security headers; httpOnly/secure/sameSite cookies; audit dependencies against the lockfile before release.

**Ask first:** new auth flows, new sensitive data, new external services, CORS changes, uploads, rate-limit changes, elevated roles.

**Never:** commit or log secrets; trust client-side validation as the boundary; disable headers for convenience; `eval` or raw HTML with user or model data; auth tokens in localStorage; stack traces to users; disabling a control as a "fix".

## AI features

Model output is untrusted data. The system prompt is not a security boundary. Do not put secrets or cross-tenant data in the context window. Scope tool permissions. Confirm destructive actions. Cap tokens, rate, and recursion.

## Dependencies

Review new packages for known vulnerabilities, typosquats, and install scripts. Prefer the ecosystem's audit tool. A critical advisory on a production dependency blocks release.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "It's an internal API." | Internal is not a trust boundary if another caller can reach it. |
| "We'll add auth after the demo." | The demo path becomes the production path. |
| "The model is instructed not to." | Instructions are not enforcement. Check in code. |

## Red flags

- String-built queries, disabled auth in a "temporary" branch, secrets in fixtures, wildcard CORS, errors that echo SQL or paths.

## Verification

Each finding has `file:line`, impact, and a fix. Critical/High include an exploit scenario. No Critical finding is left unaddressed without an explicit user acceptance.
