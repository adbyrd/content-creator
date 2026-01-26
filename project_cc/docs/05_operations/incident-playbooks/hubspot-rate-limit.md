# Incident Playbook — HubSpot Rate Limit  
**The Content Creator (CC / ACC)**

---

## Incident Definition

A **HubSpot rate-limit incident** occurs when:

- HubSpot API responses return `429 Too Many Requests`
- Read or write requests are throttled
- Delivery or eligibility checks are blocked or delayed

This is a **high-risk operational incident** because HubSpot is the system memory.

However, it is **not automatically a user-visible failure**.

---

## Severity Classification

**Severity: P1 — System Risk (Escalates to P0 if Delivery Is Impacted)**

- P1 if rate limits are absorbed by retries/caching  
- P0 if rate limits cause missed deliveries  

The goal is to keep this incident **contained internally**.

---

## Non-Negotiable Rules

During a HubSpot rate-limit incident:

- ❌ Do NOT notify users
- ❌ Do NOT pause all users globally unless required
- ❌ Do NOT disable idempotency
- ❌ Do NOT bypass HubSpot with ad hoc state storage
- ❌ Do NOT increase send volume to “catch up”

HubSpot may slow down.  
Continuity must not.

---

## Detection Signals

A rate-limit incident may be detected via:

- HubSpot API responses returning `429`
- Sudden increase in retry/backoff events
- n8n execution logs showing delayed or failed reads/writes
- Elevated latency on HubSpot requests
- Internal rate-limit threshold alerts

---

## Immediate Triage Checklist

Upon detection:

1. Confirm rate-limit scope:
   - Read endpoints
   - Write endpoints
   - Both
2. Identify affected workflows:
   - Eligibility queries
   - Snapshot reads
   - Commit writes
3. Check current delivery window:
   - Are deliveries due now?
   - Are commits pending?
4. Confirm retry and backoff behavior is active

Do **not** change system behavior yet.  
First, classify impact.

---

## Failure Classification

### A. Read-Only Rate Limit

- Eligibility queries throttled
- Snapshot reads failing
- Writes still available

➡️ Risk: delayed delivery start  
➡️ No immediate trust damage

---

### B. Write-Only Rate Limit

- Commits failing
- Reads succeeding
- Emails potentially sending

➡️ Risk: state drift, duplicates  
➡️ High idempotency risk

---

### C. Full Rate Limit (Read + Write)

- No reliable HubSpot access
- Memory temporarily unavailable

➡️ Risk: missed delivery windows  
➡️ Escalates to P0 if prolonged

---

## Recovery Strategy (By Class)

### A. Read-Only Rate Limit

**Action:**
- Enable or extend cached eligibility/snapshot reads
- Defer non-critical reads
- Maintain delivery using last-safe snapshot (bounded TTL)

**Rules:**
- Cached snapshots must be ≤ last known valid state
- Never skip eligibility gates
- Never assume new eligibility without confirmation

---

### B. Write-Only Rate Limit

**Action:**
- Allow delivery to proceed **only if**:
  - Idempotency keys are enforced
  - Email deduplication is guaranteed
- Queue commits for retry with backoff

**Rules:**
- Never write partial commits
- Never re-send an email just because commit failed
- Assume “delivered” conservatively if uncertain

---

### C. Full Rate Limit (Read + Write)

**Action:**
- Pause **new** delivery cycles silently
- Allow in-flight deliveries to complete if already snapshot-locked
- Retry HubSpot access with exponential backoff

**Rules:**
- Do not advance cadence
- Do not generate new content without a valid snapshot
- Silence is preferred over incorrect delivery

---

## Cadence Protection Rules

During and after the incident:

- Preserve original delivery rhythm
- Do not compress or stack future deliveries
- `cc_next_eligible_send_at` must resume naturally
- Never send multiple assets to compensate

Continuity is cadence, not volume.

---

## User Impact Policy

From the user’s perspective:

- Nothing is wrong
- Nothing is explained
- Nothing changes in tone or volume

If a pause is required, it must be **silent**.

If delivery resumes later, it must feel **normal**, not corrective.

---

## Escalation Criteria

Escalate to engineering leadership if:

- Rate limiting persists beyond one delivery window
- Commits cannot be reliably written after retries
- Cached snapshots exceed safe TTL
- Multiple workflows are blocked simultaneously
- Delivery-missed risk becomes non-trivial

---

## Internal Documentation Required

After resolution, log:

- Incident duration
- Affected workflows
- Rate-limit class (read / write / full)
- Whether caching or pausing was used
- Any deliveries delayed or skipped
- Preventive actions identified

This documentation is internal only.

---

## Prevention Checklist

After incident closure:

- Are HubSpot reads batched efficiently?
- Are writes minimized and scoped?
- Are eligibility queries too frequent?
- Are retries/backoff correctly tuned?
- Is there sufficient snapshot caching?

If any answer is “no,” remediation must be scheduled.

---

## Final Principle

HubSpot slowing down is expected.

Letting that slowdown reach the user is not.

---

## One-Line Doctrine

HubSpot may forget for a moment.

The system must not.
