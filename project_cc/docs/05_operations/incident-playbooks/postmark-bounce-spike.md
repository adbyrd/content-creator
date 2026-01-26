# Incident Playbook — Postmark Bounce Spike  
**The Content Creator (CC / ACC)**

---

## Incident Definition

A **Postmark bounce spike incident** occurs when:

- Bounce rate exceeds normal baseline by a statistically significant margin
- Postmark reports elevated hard or soft bounces
- Sender reputation or deliverability is at risk
- Email delivery success becomes unreliable

This is a **reputation-critical incident**.

Poor deliverability threatens continuity across all users, not just those bouncing.

---

## Severity Classification

**Severity: P1 — Reputation Risk**  
**Escalates to P0 if deliveries are blocked or suspended**

- P1: Bounce spike detected but delivery continues
- P0: Postmark throttles, suppresses, or suspends sending

---

## Non-Negotiable Rules

During a bounce spike:

- ❌ Do NOT notify users
- ❌ Do NOT resend bounced emails automatically
- ❌ Do NOT change copy, subject lines, or volume reactively
- ❌ Do NOT bypass Postmark or rotate domains ad hoc
- ❌ Do NOT “catch up” with bulk sends later

Sender trust > short-term delivery volume.

---

## Detection Signals

A bounce spike may be detected via:

- Postmark dashboard alerts
- Sudden increase in:
  - Hard bounces
  - Spam complaints
  - Suppression events
- Drop in accepted or delivered messages
- Internal monitoring of bounce-rate SLOs

---

## Immediate Triage Checklist

Upon detection:

1. Identify bounce type distribution:
   - Hard bounces (invalid address)
   - Soft bounces (temporary failure)
   - Spam complaints
2. Determine scope:
   - Single campaign
   - Single domain
   - System-wide
3. Confirm current Postmark status:
   - Normal
   - Throttled
   - Temporarily suspended
4. Check whether deliveries are currently due

Do **not** change cadence yet.  
First, classify the spike.

---

## Failure Classification

### A. Hard Bounce Spike

Characteristics:
- Invalid or non-existent email addresses
- Previously suppressed contacts resurfacing
- Data hygiene issue

➡️ Risk: sender reputation degradation

---

### B. Soft Bounce Spike

Characteristics:
- Temporary inbox issues
- Provider throttling
- Large mailbox providers involved

➡️ Risk: delayed delivery, escalating to suppression

---

### C. Spam Complaint Spike

Characteristics:
- “Mark as spam” events
- User-level rejection signals
- Dangerous reputation impact

➡️ Immediate escalation risk

---

## Recovery Strategy (By Class)

### A. Hard Bounce Spike

**Action:**
- Immediately suppress all hard-bounced contacts
- Verify no suppressed contact is eligible for delivery
- Audit intake and upsert logic for invalid emails

**Rules:**
- Never reattempt delivery to a hard-bounced address
- Suppression is permanent unless manually reviewed

---

### B. Soft Bounce Spike

**Action:**
- Allow Postmark’s retry logic to operate
- Reduce concurrent send rate if configurable
- Monitor escalation to hard bounces

**Rules:**
- Do not manually retry sends
- Do not advance cadence for affected users
- Assume delivery uncertainty conservatively

---

### C. Spam Complaint Spike

**Action:**
- Immediately pause **new** sends if complaint rate crosses Postmark thresholds
- Escalate to engineering leadership
- Review recent copy, onboarding changes, or audience shifts

**Rules:**
- Silence is preferable to reputation damage
- Never attempt “win-back” messaging during a spike

---

## Cadence Protection Rules

During and after the incident:

- Preserve original delivery rhythm
- Do not increase volume to compensate
- Resume sending gradually once Postmark health stabilizes
- Maintain `cc_next_eligible_send_at` alignment

Continuity is rhythm, not density.

---

## User Impact Policy

From Sarah’s perspective:

- No explanation
- No apology
- No change in tone
- No sudden volume spikes

If a user is suppressed:
- Delivery stops silently
- No notification is sent

---

## Escalation Criteria

Escalate immediately if:

- Postmark flags the account for review
- Sending is throttled or suspended
- Spam complaint rate exceeds acceptable thresholds
- Bounce spike persists across multiple delivery windows

---

## Internal Documentation Required

After resolution, log:

- Incident duration
- Bounce type breakdown
- Affected contact count
- Whether sending was paused or throttled
- Root cause hypothesis
- Preventive actions identified

This documentation is internal only.

---

## Prevention Checklist

After incident closure:

- Are email addresses validated at intake?
- Are suppressed contacts permanently excluded?
- Is onboarding copy setting correct expectations?
- Are cadence and volume stable?
- Are unsubscribe signals respected immediately?

Any weakness must be scheduled for remediation.

---

## Final Principle

Deliverability is trust at scale.

One bad spike can undo months of quiet reliability.

---

## One-Line Doctrine

If email stops landing,  
**the product stops existing**.
