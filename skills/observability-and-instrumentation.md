# Observability and Instrumentation

Instrument as you build, not after the incident. You should be able to tell, from telemetry, whether users are succeeding. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT).

## When to use

A new critical path, a production deploy, or any request to add logs, metrics, traces, or alerts.

## When not to use

A local script with no operator. Do not add a telemetry stack for a change that never runs unattended.

## Process

1. Name the question an on-call engineer will ask: who is failing, how often, and where in the path.
2. **Logs.** Structured fields, not prose. Include a correlation id. Never log secrets, tokens, or full payment data.
3. **Metrics.** RED for services: rate, errors, duration. USE (utilization, saturation, errors) for resources when you operate them. Label carefully; unbounded label values are a cardinality incident.
4. **Traces.** Span the path that crosses a boundary (handler → dependency). Propagate the existing trace id; do not invent a second one.
5. **Alerts.** Symptom-based: users cannot complete the action, error rate or latency breached a budget. Do not alert on every cause. Every alert needs a human action and a link to the dashboard or query.
6. Add a health check the deploy can hit (`shipping-and-launch`).

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "We'll add logs if it fails." | Production failure without a correlation id is not debuggable. |
| "Log the whole request." | That is how secrets leak. Log identifiers and outcomes. |
| "Alert on CPU." | Alert on the user symptom. CPU is a clue, not a page. |

## Red flags

- `console.log` of payloads left as the observability plan.
- Alerts with no owner and no action.
- Metrics labeled by user id or raw URL.

## Verification

For the new path: one structured log line, one RED-style signal or an explicit "not applicable", and the alert or dashboard a human would open. Show a sample event with secrets redacted.
