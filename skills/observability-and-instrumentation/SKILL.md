---
name: observability-and-instrumentation
description: "Adds structured logs, RED metrics, traces, and symptom-based alerts to critical paths. Use for new critical paths, production deploys, or requests for logging, metrics, or alerts."
---

# Observability and Instrumentation

Instrument as you build, not after the incident. Telemetry should show whether users are succeeding.

## When to use

A new critical path, a production deploy, or any request for logs, metrics, traces, or alerts.

## Process

1. Name the on-call question: who is failing, how often, and where in the path.
2. **Logs.** Structured fields with a correlation id. Never log secrets, tokens, or full payment data.
3. **Metrics.** RED for services, USE for resources you operate. Never label by user id or raw URL.
4. **Traces.** Span boundary crossings. Propagate the existing trace id; do not invent a second one.
5. **Alerts.** Symptom-based only: users cannot complete the action, or a budget is breached. Every alert needs a human action and a dashboard link.
6. Add a health check the deploy can hit (`shipping-and-launch`).

## Verification

One structured log line, one RED signal (or an explicit "not applicable"), and the dashboard or alert a human would open. Show a sample event with secrets redacted.
