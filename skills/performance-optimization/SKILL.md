---
name: performance-optimization
description: "Measures and fixes performance regressions and hot paths such as N+1 queries, unbounded fetches, and web vitals. Use when a performance requirement exists or a review flags a hot path."
---

# Performance Optimization

Measure first. Optimize only what the evidence says matters. Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT), including the web-performance auditor's metric-honesty rule.

## When to use

A performance requirement exists, you suspect a regression, or a review flags a hot path, N+1 query, unbounded fetch, or web-vitals risk.

## When not to use

There is no symptom and no budget. Do not micro-optimize cold code.

## Metric honesty

Never fabricate timings or Core Web Vitals. Reading source cannot measure LCP, INP, or CLS.

- **Quick mode** (no trace, lab report, or field data): source-level findings only, tagged `potential impact`. Scorecard marked `not measured`.
- **Deep mode** (Lighthouse, PageSpeed Insights, CrUX, or a performance trace): label each number with its source. Field data and lab data are not interchangeable.

If a source is missing, leave that field `not measured`. Inventing a number is worse than omitting it.

## Process

1. Define the symptom and the budget (latency, query count, bundle size, or a vital). Identify the framework before recommending framework-specific fixes.
2. Measure with the project's profiler, query log, or a lab report. Record the baseline.
3. Find the dominant cost. Fix that. Do not shotgun-optimize.
4. Re-measure. Keep the change only if the number moved and behavior is unchanged.
5. Add a guard where the stack allows it: a query-count assertion, a bundle budget, or a documented benchmark command.

## Watch for

N+1 queries, unbounded lists without pagination, synchronous work on a request path, missing indexes on new filters, chatty remote calls, uncached repeated work, and — in UI — unoptimized images, render-blocking scripts, and layout shifts from unsized media. Targets, when measured: LCP under 2.5s, INP under 200ms, CLS under 0.1. Those are goals, not numbers you may invent.

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "This will be faster." | Show the before and after. |
| "LCP is probably fine." | Probably is not a measurement. |
| "Optimize everything while we're here." | Optimize the measured bottleneck. |

## Red flags

- A performance claim with no command output or report.
- A cache or index added without a test that the result is still correct.
- Framework advice that does not match the framework in the repo.

## Verification

Baseline, change, and after-measurement, each labeled with its source. Unmeasured items stay `not measured`.
