# Release Process  
**The Content Creator (CC / ACC)**  
Production Change & Deployment Doctrine

---

## Purpose

This document defines the **only approved release process** for the CC / ACC system.

It exists to ensure that:
- Content delivery never stops
- Trust is never broken by experimentation
- Changes are survivable under user inactivity
- Engineers can ship without fear of cascading failure

This is not a suggestion.
This is operational law.

---

## Governing Principle

Every release must preserve one outcome above all else:

> **“I disappeared… and this didn’t.”**

If a release risks breaking this outcome, it must not ship.

---

## What Counts as a Release

A release is **any change** that can affect:

- Delivery cadence
- Email sending
- Prompt payloads
- Generation logic
- Vendor integrations
- HubSpot schema or properties
- n8n workflows
- Retry, idempotency, or commit logic

Documentation-only changes are not releases.

Everything else is.

---

## Release Philosophy

- **Continuity > Velocity**
- **Predictability > Novelty**
- **Rollbackability > Cleverness**
- **Silence > Explanation**

The system is not allowed to surprise users.

---

## Release Types

### 1. Safe Changes (Low Risk)

Examples:
- Documentation updates
- Internal comments
- Observability improvements
- New metrics or logging (read-only)

**Rules:**
- May ship independently
- Must not alter runtime behavior
- Must not introduce new dependencies

---

### 2. Controlled Changes (Medium Risk)

Examples:
- Prompt wording changes
- Non-critical vendor tuning
- Copy changes that affect generation
- Eligibility query adjustments

**Rules:**
- Must be backward compatible
- Must be feature-flagged or gated
- Must have an explicit rollback plan

---

### 3. Critical Changes (High Risk)

Examples:
- Cadence logic
- Commit behavior
- Delivery status transitions
- HubSpot schema changes
- Email send logic
- Idempotency changes

**Rules:**
- Require full pre-release checklist
- Require dry-run validation
- Require leadership awareness
- Require explicit rollback execution steps

If unsure which category applies, treat the change as **critical**.

---

## Pre-Release Checklist (Required)

Before **any** production release:

### Architecture & Contracts
- [ ] Change aligns with `07_automated-content-delivery-system.md`
- [ ] Change does not violate Product Contract
- [ ] Single-spine architecture preserved
- [ ] No per-user workflows introduced

### Data & Schema
- [ ] HubSpot schema updated (if applicable)
- [ ] Backward compatibility confirmed
- [ ] No destructive migrations
- [ ] Default values defined for new fields

### Delivery Safety
- [ ] Idempotency preserved
- [ ] Commit-only-on-success enforced
- [ ] No optimistic writes introduced
- [ ] Cadence cannot be compressed accidentally

### Failure & Recovery
- [ ] Failure mode identified
- [ ] Recovery path documented
- [ ] No user action required for recovery
- [ ] Relevant incident playbooks updated (if needed)

### Observability
- [ ] Success/failure is measurable internally
- [ ] Alerts will trigger before user impact
- [ ] Logs allow post-incident reconstruction

If any item cannot be checked, the release does not ship.

---

## Release Execution Process

### Step 1 — Prepare
- Finalize code and configuration
- Validate against fixtures and snapshots
- Ensure feature flags are default-off (if used)

### Step 2 — Dry Run (When Applicable)
- Execute workflow against test contacts
- Confirm:
  - No duplicate sends
  - No premature commits
  - No cadence drift
- Validate rollback steps actually work

### Step 3 — Deploy
- Ship during low-risk windows
- Avoid overlapping with:
  - Vendor maintenance
  - Known rate-limit pressure
  - Large onboarding pushes

### Step 4 — Monitor (Quietly)
- Watch internal metrics only
- Do not announce releases
- Do not “check in” with users

### Step 5 — Stabilize
- Allow at least one full delivery cycle
- Confirm:
  - No missed deliveries
  - No spike in errors or bounces
  - No cadence anomalies

---

## Rollback Rules

Rollback must be:
- Fast
- Scripted
- Non-destructive

### When to Roll Back
- Any missed delivery
- Any duplicate delivery
- Any unexplained cadence shift
- Any loss of idempotency confidence

### Rollback Behavior
- Restore last known good state
- Preserve delivery rhythm
- Do not compensate with extra sends
- Do not explain to users

Silence + stability beats explanation.

---

## Hotfix Policy

Hotfixes are allowed **only** to:
- Restore delivery
- Prevent missed delivery
- Contain a live incident

Hotfixes must:
- Follow the same checklist
- Be documented after the fact
- Result in a scheduled follow-up release

There are no “temporary” production hacks.

---

## Change Windows

Preferred:
- Low-volume delivery windows
- When recovery time exists before next cadence

Avoid:
- Right before scheduled delivery spikes
- During known vendor instability
- During large user onboarding waves

---

## Documentation Requirements

Every release must update (if applicable):
- Architecture docs
- Contracts
- Runbook
- Incident playbooks

If documentation lags reality, **reality must be rolled back**.

---

## Final Enforcement Rule

If a release:
- Requires user attention
- Requires user explanation
- Requires manual babysitting
- Requires hope instead of certainty

It violates this process and must not ship.

---

## One-Line Doctrine

A good release is invisible.

A bad release teaches the user  
that the system can’t be trusted.
