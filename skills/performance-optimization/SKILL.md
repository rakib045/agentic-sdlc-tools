---
name: performance-optimization
description: "Measures and fixes performance regressions and hot paths such as N+1 queries, unbounded fetches, and web vitals. Use when a performance requirement exists or a review flags a hot path."
---

# Performance Optimization

Measure first. Optimize only what the evidence says matters.

## When to use

A performance requirement exists, you suspect a regression, or a review flags a hot path.

## When not to use

No symptom and no budget. Do not micro-optimize cold code.

## Metric honesty

Never fabricate timings or Core Web Vitals. Reading source cannot measure LCP, INP, or CLS.

- **Quick mode** (no trace or report): source findings tagged `potential impact`. Scorecard marked `not measured`.
- **Deep mode** (Lighthouse, PSI, CrUX, or a trace): label every number with its source. Field and lab data are not interchangeable.

## Process

1. Define the symptom and budget. Identify the framework before recommending framework fixes.
2. Measure with the project's profiler or query log. Record the baseline.
3. Fix the dominant cost. Do not shotgun-optimize.
4. Re-measure. Keep the change only if the number moved and behavior is unchanged.
5. Add a guard where possible: query-count assertion, bundle budget, or benchmark command.

## Watch for

N+1 queries, unbounded lists, synchronous work on request paths, missing indexes, chatty remote calls, and in UI: unoptimized images, render-blocking scripts, unsized media. Targets when measured: LCP under 2.5s, INP under 200ms, CLS under 0.1.

## Verification

Baseline, change, and after-measurement, each labeled with its source. Unmeasured items stay `not measured`.
