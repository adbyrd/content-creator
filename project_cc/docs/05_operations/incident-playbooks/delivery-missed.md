# Incident Playbook — Delivery Missed  
**The Content Creator (CC / ACC)**

---

## Incident Definition

A **delivery-missed incident** occurs when:

- A user was eligible for delivery  
- The scheduled delivery window passed  
- No email was successfully delivered  

This is the **highest-severity trust incident** in the system.

Bad content is recoverable.  
Missed delivery damages belief.

---

## Severity Classification

**Severity: P0 — Trust-Critical**

This incident must be handled immediately and silently.

Do **not**:
- Notify the user
- Apologize proactively
- Explain system issues
- Ask the user to take action

---

## Non-Negotiable Rules

Before doing anything else:

- ❌ Do NOT email the user about the miss  
- ❌ Do NOT “catch up” with multiple sends  
- ❌ Do NOT blame vendors in user-facing channels  
- ❌ Do NOT reset cadence blindly  

The goal is **continuity restoration**, not explanation.

---

## Detection Signals

A delivery-missed incident may be detected via:

- Scheduled audit job finds:
  - `now > cc_next_eligible_send_at`
  - AND `cc_last_delivery_at < previous_expected_window`
- Postmark logs show no accepted send
- n8n execution history shows:
  - failure before send
  - partial execution with no commit
- Delivery success rate drops below SLO

---

## Immediate Triage Checklist

Within the first review:

1. Identify affected contacts
2. Confirm:
   - delivery_status == `active`
   - contact was eligible at scheduled time
3. Verify:
   - no email send occurred
   - no commit was written
4. Freeze any automated retries temporarily if they risk duplication

Do **not** act per-user yet.  
First classify the failure.

---

## Failure Classification

Determine **why** delivery was missed:

### A. Pre-Generation Failure
Examples:
- Scheduler did not fire
- Eligibility query failed
- Snapshot read failed

➡️ No content generated

---

### B. Generation Failure
Examples:
- LLM timeout
- Media render failure
- Guardrail rejection loop

➡️ Content partially or fully generated but not sent

---

### C. Delivery Failure
Examples:
- Postmark API error
- Message rejected
- Silent send failure with no confirmation

➡️ Content generated but not delivered

---

### D. Commit Failure
Examples:
- Email sent
- HubSpot write failed
- Commit skipped or errored

➡️ User may have received content, but system state is incorrect

---

## Recovery Strategy (By Class)

### A. Pre-Generation Failure

**Action:**
- Re-run delivery cycle once with:
  - fresh snapshot
  - same cadence window
- Enforce idempotency key

**Rule:**
- Only one replay attempt
- If it fails again → pause + alert

---

### B. Generation Failure

**Action:**
- Re-run generation using the original snapshot
- Do not advance cadence
- Do not modify prompt variables

**Rule:**
- Never regenerate with different inputs for the same window

---

### C. Delivery Failure

**Action:**
- Attempt resend with the same payload
- Enforce email idempotency
- Confirm Postmark acceptance before commit

**Rule:**
- Never change subject, content, or timing label
- User must perceive this as “on time,” not “make-up”

---

### D. Commit Failure

**Action:**
- Confirm whether the user received the email
- If yes:
  - Write commit retroactively
  - Preserve cadence
- If unknown:
  - Assume delivered
  - Write conservative commit
  - Do NOT resend

**Rule:**
- Avoid duplicates at all cost

---

## Cadence Correction Rules

After recovery:

- `cc_next_eligible_send_at` must:
  - Maintain original cadence rhythm
  - Not compress future sends
- Never send two assets to “catch up”
- Never apologize with extra volume

Continuity > compensation.

---

## User Impact Policy

**User must experience:**
- No explanation
- No disruption
- No change in tone
- No visible “system event”

From Sarah’s POV:
> “It just showed up.”

If that is preserved, the incident is considered contained.

---

## Internal Documentation Required

After resolution, log:

- Incident timestamp
- Affected contact count
- Failure class
- Root cause
- Recovery action taken
- Whether any users were paused
- Whether safeguards were added

This log is internal only.

---

## Escalation Criteria

Escalate to engineering leadership if:

- More than one delivery window is missed
- Multiple users affected simultaneously
- Root cause is systemic (scheduler, schema, vendor)
- Idempotency guarantees are unclear

---

## Prevention Checklist

After incident closure, ask:

- Should this failure have been detected earlier?
- Is there a missing eligibility guard?
- Is idempotency too weak?
- Is a vendor dependency too brittle?
- Is commit discipline being violated?

If prevention work is identified, it must be scheduled.

---

## Final Principle

A missed delivery is not a messaging problem.

It is a **continuity failure**.

Fix the system.  
Protect the cadence.  
Never involve the user.

---

## One-Line Doctrine

If Sarah notices the system failed,  
**we failed twice**.
