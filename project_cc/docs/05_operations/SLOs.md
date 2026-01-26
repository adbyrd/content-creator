# Service Level Objectives (SLOs)  
**The Content Creator (CC / ACC)**  
Reliability, Trust, and Continuity Standards

---

## Purpose

This document defines the **service level objectives** for the CC / ACC system.

These SLOs exist to:
- Protect user trust through continuity
- Provide clear internal reliability targets
- Trigger incident response before user impact
- Align engineering decisions with executive intent

SLOs are **internal guardrails**, not marketing promises.

---

## Governing Principle

The only outcome that matters:

> **“I disappeared… and this didn’t.”**

If an SLO breach threatens this outcome, it must be treated as a priority incident.

---

## What SLOs Are (and Are Not)

### SLOs ARE
- Reliability targets for delivery
- Signals for when to pause, rollback, or intervene
- Inputs to incident playbooks and release decisions

### SLOs are NOT
- Guarantees to users
- SLAs with credits or penalties
- Growth or engagement metrics
- Optimization goals

Reliability beats performance.

---

## Core SLOs (Authoritative)

### 1. Delivery Success Rate

**Definition**  
Percentage of eligible delivery cycles that result in a successfully sent email.

**Target**  
≥ **99.5%**

**Measurement Window**  
Rolling 30-day window

**Breach Threshold**  
< 99.0% → P0 incident (`delivery-missed.md`)

**Notes**
- Measured at the email layer (Postmark accepted/delivered)
- Generation success without email send does not count

---

### 2. On-Time Delivery Rate

**Definition**  
Percentage of deliveries sent within their expected cadence window.

**Target**  
≥ **99.0%**

**Measurement Window**  
Rolling 30-day window

**Breach Threshold**  
< 98.5% → P0 incident

**Notes**
- Late delivery counts as failure
- “Catch-up” sends do not count as on-time

---

### 3. Duplicate Delivery Rate

**Definition**  
Percentage of users receiving more than one delivery for the same cadence window.

**Target**  
≤ **0.1%**

**Measurement Window**  
Rolling 30-day window

**Breach Threshold**  
> 0.25% → P0 incident (idempotency failure)

**Notes**
- Duplicate delivery is more damaging than a missed one
- Zero tolerance during incident recovery

---

### 4. Silent Failure Rate

**Definition**  
Failures handled internally without user notification that still resolve within the same cadence window.

**Target**  
≥ **95% of failures resolved silently**

**Measurement Window**  
Rolling 30-day window

**Breach Threshold**  
< 90% → process review required

**Notes**
- This is a *positive* SLO
- Indicates system maturity and resilience

---

### 5. Mean Time to Recovery (MTTR)

**Definition**  
Median time from failure detection to restored normal delivery.

**Target**  
≤ **1 delivery window**

**Measurement Window**  
Rolling 90-day window

**Breach Threshold**  
> 2 delivery windows → escalation required

**Notes**
- Recovery is defined as restored cadence, not root-cause fix

---

## Supporting SLOs (Secondary)

### 6. HubSpot Availability (Effective)

**Definition**  
Percentage of time HubSpot access is sufficient to maintain delivery (via caching, retries, or pause).

**Target**  
≥ **99.0%**

**Notes**
- Measured as *effective availability*, not raw API uptime
- Governed by `hubspot-rate-limit.md`

---

### 7. Vendor Generation Success Rate

**Definition**  
Percentage of generation jobs that complete successfully within retry limits.

**Target**  
≥ **98.5%**

**Notes**
- Failures may be absorbed silently
- Governed by `vendor-outage.md`

---

### 8. Email Bounce Rate

**Definition**  
Percentage of sent emails that result in a bounce.

**Target**  
≤ **1.0% hard bounces**  
≤ **2.5% total bounces**

**Breach Threshold**  
Spike above baseline → P1 (`postmark-bounce-spike.md`)

---

## Error Budget Policy

### Error Budget Concept

The error budget represents **how much failure the system can tolerate** while still meeting trust expectations.

- Small failures are expected
- Repeated failures are not

### Usage Rules
- If error budget is healthy → releases may proceed
- If error budget is depleted → freeze non-critical releases
- Error budget is restored only through sustained reliability

---

## SLO Breach Response

When an SLO breach occurs:

1. **Classify severity**
   - P0: Trust at risk
   - P1: System risk
2. **Activate the relevant incident playbook**
3. **Stabilize delivery first**
4. **Preserve cadence**
5. **Document internally**
6. **Schedule prevention work**

Never message users about SLOs.

---

## Relationship to Releases

- Releases that increase SLO risk require explicit acceptance
- No major release during an active SLO breach
- If an SLO breach occurs after a release, rollback is preferred over tuning

Reliability debt must be paid down before shipping new behavior.

---

## Review Cadence

- SLOs reviewed quarterly
- Targets may only be tightened, not loosened, without leadership approval
- Any change must preserve the core trust outcome

---

## Enforcement Rule

If a team decision:
- Improves speed but worsens SLOs
- Improves features but risks delivery
- Improves metrics but harms continuity

The decision must be rejected.

---

## One-Line Doctrine

Users never see our SLOs.

They only feel them  
when something stops showing up.
