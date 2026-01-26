# Engineering Runbook  
**The Content Creator (CC / ACC)**  
Operational Guide for Automation Engineers  
Version: 1.0.0

---

## Purpose of This Runbook

This runbook exists to ensure:

- Continuous content delivery even when users disappear
- Predictable recovery from API, vendor, or data failures
- Safe iteration without breaking live delivery
- Shared operational understanding across engineering shifts

This is not onboarding documentation.
This is **operational doctrine**.

If you follow this runbook, the system survives.

---

## Operational North Star

Success is not engagement.  
Success is continuity.

> **“I disappeared… and this didn’t.”**

Every decision, fix, and refactor must protect this outcome.

---

## Product Contract (Non-Negotiable)

The system must always deliver:

- **Asset:** One 30-second vertical short
- **Format:** 9:16, platform-ready
- **Cadence:** Every other day
- **Delivery Channel:** Email (canonical)
- **Start Condition:** Prompt profile completion
- **User Requirement After Onboarding:** None

If this contract is broken, trust is broken.

Everything else is replaceable.

---

## Core Design Assumptions (Treat as Constraints)

Engineers must always assume:

- Users may never log in again
- Users may never complete optional steps
- Users may disappear for weeks
- APIs will fail
- Vendors will change or degrade
- Volume will scale from hundreds to thousands
- Missed delivery causes more damage than mediocre content

❗ Never introduce logic that requires user action to restore delivery.

---

## System Roles (Mental Model)

### Single-Spine Architecture

