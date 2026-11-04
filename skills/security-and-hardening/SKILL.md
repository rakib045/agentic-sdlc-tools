---
name: security-and-hardening
description: "Hardens code that handles untrusted input, auth, sessions, sensitive data, uploads, webhooks, payments, PII, new dependencies, or AI tool calls. Use for any security-relevant change."
---

# Security and Hardening

Treat every external input as hostile, every secret as sacred, and every authorization check as mandatory.

## When to use

Untrusted input, auth, sessions, sensitive data, uploads, webhooks, payments, PII, new dependencies, or AI features that can call tools.

## Process

1. **Map trust boundaries.** HTTP, forms, uploads, webhooks, queues, third-party APIs, model output. Trust follows who wrote the value, not the channel.
2. **Name the assets.** Credentials, PII, payment data, admin actions.
3. **STRIDE each boundary.** Write the abuse case next to the use case.
4. If you cannot name the boundaries, you are not ready to secure the feature.

## Three-tier boundary

**Always:** validate at the boundary; parameterize queries; encode output; use HTTPS and strong password hashing; set security headers; set httpOnly, secure, and sameSite on cookies; audit dependencies before release.

**Ask first:** new auth flows, sensitive data, external services, CORS changes, uploads, rate-limit changes, elevated roles.

**Never:** commit or log secrets; trust client-side validation; disable headers for convenience; use `eval` or raw HTML with user or model data; store auth tokens in localStorage; show stack traces to users; disable a control as a "fix".

## AI features

Model output is untrusted. The system prompt is not a boundary. Keep secrets and cross-tenant data out of context. Scope tool permissions. Confirm destructive actions.

## Dependencies

Check new packages for known vulnerabilities and install scripts. A critical advisory on a production dependency blocks release.

## Verification

Each finding has `file:line`, impact, and a fix. Critical and High include an exploit scenario. No Critical finding is left unaddressed without explicit user acceptance.
