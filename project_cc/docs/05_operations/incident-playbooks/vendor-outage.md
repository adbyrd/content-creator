# Incident Playbook — Vendor Outage  
**The Content Creator (CC / ACC)**

---

## Incident Definition

A **vendor outage incident** occurs when one or more external generation vendors:

- Are unavailable (timeouts, 5xx, network failures)
- Return degraded or invalid output
- Exceed acceptable latency thresholds
- Are rate-limited or suspended

Vendors include (non-exhaustive):
- LLM providers
- Media renderers
- Voice synthesis
- Asset processing services

This is a **reliability incident**, not a user problem.

---

## Severity Classification

**Severity: P1 — Delivery Risk**  
**Escalates to P0 if delivery windows are missed**

- P1: Vendor unavailable but delivery not yet impacted
- P0: Vendor outage threatens or causes missed deliveries

---

## Non-Negotiable Rules

During a vendor outage:

- ❌ Do NOT notify users
- ❌ Do NOT explain vendor issues publicly
- ❌ Do NOT switch prompts, tone, or content strategy reactively
- ❌ Do NOT bypass guardrails to “force output”
- ❌ Do NOT compensate with extra volume later

Continuity is preserved by **control**, not improvisation.

---

## Detection Signals

A vendor outage may be detected via:

- Increased timeout or 5xx rates
- Latency exceeding defined SLOs
- Repeated guardrail failures
- Vendor status page alerts
- n8n execution failures isolated to vendor steps

---

## Immediate Triage Checklist

Upon detection:

1. Identify affected vendor(s)
2. Confirm scope:
   - Single vendor
   - Multiple vendors
   - Critical path or optional enhancement
3. Determine current delivery window:
   - Are deliveries due now?
   - Are in-flight jobs snapshot-locked?
4. Confirm idempotency keys are active

Do **not** reroute traffic yet.  
First, classify impact.

---

## Failure Classification

### A. Non-Critical Vendor Outage

Characteristics:
- Optional enhancement vendor unavailable
- Core generation path still functional

➡️ Risk: reduced quality, not missed delivery

---

### B. Critical Vendor Outage (Generation)

Characteristics:
- LLM or primary content generator unavailable
- No valid content can be produced

➡️ Risk: delayed or missed delivery

---

### C. Critical Vendor Outage (Rendering)

Characteristics:
- Script generation succeeds
- Media rendering fails or times out

➡️ Risk: asset unavailable for email delivery

---

### D. Partial Degradation

Characteristics:
- Vendor responds intermittently
- Success rate below acceptable threshold
- Latency spikes cause retry storms

➡️ Risk: cascading failures, missed windows

---

## Recovery Strategy (By Class)

### A. Non-Critical Vendor Outage

**Action:**
- Disable optional enhancement step
- Proceed with core generation path
- Preserve cadence and delivery

**Rules:**
- Never block delivery for optional features
- Document quality degradation internally

---

### B. Critical Vendor Outage (Generation)

**Action:**
- Pause **new** delivery cycles silently
- Allow in-flight cycles to complete only if snapshot-locked
- Retry vendor access with exponential backoff

**Rules:**
- Do not generate content with alternate prompts or models ad hoc
- Do not advance cadence during pause
- Silence is preferable to incorrect output

---

### C. Critical Vendor Outage (Rendering)

**Action:**
- Retry render using the same generated content
- If retries fail within window:
  - Hold delivery
  - Resume once rendering is restored

**Rules:**
- Never regenerate content for the same window
- Never send partial or placeholder assets

---

### D. Partial Degradation

**Action:**
- Reduce concurrency
- Enforce stricter retry limits
- Prefer fewer clean runs over many unstable attempts

**Rules:**
- Avoid retry storms
- Preserve idempotency boundaries

---

## Cadence Protection Rules

During and after the outage:

- Maintain original delivery rhythm
- Do not compress or stack future deliveries
- Resume with the next eligible window
- Never “make up” missed sends with extra volume

Cadence is trust.

---

## User Impact Policy

From Sarah’s perspective:

- No outage explanation
- No apology email
- No sudden changes in tone or volume

If delivery resumes later, it must feel **normal**, not corrective.

---

## Escalation Criteria

Escalate to engineering leadership if:

- Outage persists beyond one delivery window
- Multiple vendors fail simultaneously
- Idempotency guarantees are at risk
- Retry storms threaten system stability
- Delivery-missed risk becomes likely

---

## Internal Documentation Required

After resolution, log:

- Incident duration
- Affected vendors
- Failure classification
- Whether delivery was paused
- Any deliveries delayed or skipped
- Root cause (if known)
- Preventive actions identified

This documentation is internal only.

---

## Prevention Checklist

After incident closure:

- Are vendors properly abstracted?
- Is there a clear critical vs optional path?
- Are retries bounded and backoff tuned?
- Are vendor SLOs realistic?
- Is fail-closed behavior enforced for critical steps?

If any answer is “no,” remediation must be scheduled.

---

## Final Principle

Vendors will fail.

Letting that failure reach the user is optional.

---

## One-Line Doctrine

If a vendor goes down,  
**the system waits—quietly—until it can be right**.
