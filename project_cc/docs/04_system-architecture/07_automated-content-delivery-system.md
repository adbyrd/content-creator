# Automated Content Delivery System  
**The Content Creator (CC / ACC)**  
Architecture, Governance, and Information Lifecycle

---

## Purpose of This Document

This document defines how the CC / ACC system **actually operates**.

It exists to:
- Translate executive intent into enforceable system behavior
- Align engineering decisions with Sarah’s psychological reality
- Define reliability standards for content delivery
- Ensure continuity even when users, vendors, or team members disappear

This is **not** a product spec.  
This is **operational doctrine**.

---

## Governing Principle

Success is not engagement.  
Success is continuity.

> **“I disappeared… and this didn’t.”**

If this statement is no longer true, the system has failed—regardless of content quality, features, or growth.

---

## Product Contract (Non-Negotiable)

What the system must deliver:

- **Asset:** One short-form content asset  
- **Format:** 30-second vertical (9:16), platform-ready  
- **Cadence:** Every other day  
- **Delivery Channel:** Email (canonical surface)  
- **Initiation:** After prompt profile completion  
- **User Requirement After Onboarding:** None  

Everything else is implementation detail.

---

## Core Design Assumptions (Treat as Constraints)

The system must assume:

- Users may never log in again  
- Users may never complete optional steps  
- Users may disappear for weeks  
- APIs will fail  
- Vendors will change or degrade  
- Volume will scale from hundreds → thousands  
- Missed delivery destroys trust faster than bad content  

Any design that violates these assumptions must be rejected.

---

## System Overview

### Single-Spine Architecture

HubSpot (Memory / Ledger)
↓
n8n (Operator / Orchestrator)
↓
Generation Vendors (Stateless)
↓
Email (The Product)


There is **one spine**.  
There are **no per-user workflows**.

---

## Component Roles

### HubSpot — Memory
HubSpot is used as:
- Canonical user record
- Prompt variable store
- Delivery state ledger
- Audit and compliance trail
- Human-safe override surface

HubSpot is **not**:
- A workflow engine
- A scheduler
- A logic layer
- A UI for the user

If HubSpot disappeared tomorrow, CC must still function with minimal rewiring.

---

### n8n — Operator
n8n owns:
- State orchestration
- Scheduling and cadence enforcement
- Idempotency
- Retry logic
- Failure classification
- Write-commit discipline

n8n is the **brain** of the system.

---

### Generation Vendors — Stateless Workers
Examples:
- LLMs
- Voice synthesis
- Media rendering services

Rules:
- Receive structured payloads only
- Never store user state
- Never call HubSpot directly
- Fully replaceable without system redesign

---

### Email — The Product
Email is the **only thing Sarah experiences**.

If the email does not arrive, delivery did not occur.

All delivery success is measured from the email layer backward.

---

## Prompt Profile Variable Architecture

### Storage Model
- Each variable is an atomic HubSpot property
- No compound JSON blobs unless unavoidable
- Variables are append-safe and schema-versioned
- Partial completion is valid

### Example Variable Categories
- Business summary
- Target audience
- Tone constraints
- Platform priority
- Visual style hints
- Content avoidance
- Delivery status
- Last / next delivery timestamps

The system must tolerate missing **non-critical** variables via defaults.  
Missing **critical** variables must trigger a **silent pause**, not a user prompt.

---

## Delivery Cycle (Happy Path)

### Read Phase
1. Scheduled trigger fires in n8n  
2. n8n queries HubSpot for eligible contacts  
3. Full contact snapshot is fetched  
4. Snapshot is frozen for the cycle  
5. Prompt payload is assembled  

> Prompt generation always uses a point-in-time snapshot.

---

### Generate Phase
6. Snapshot is passed to generators  
7. Script and assets are produced  
8. Guardrails validate output  

Generators do not mutate system state.

---

### Delivery Phase
9. Email payload is constructed  
10. Email is sent  
11. Delivery success is confirmed (or best-available signal)

---

### Commit Phase (Write-Only on Success)
12. n8n writes back to HubSpot:
   - `cc_last_delivery_at`
   - `cc_next_eligible_send_at`
   - `cc_delivery_count`
   - `cc_last_asset_id`
   - Error flags (if applicable)

**No optimistic writes are allowed.**

---

## Delivery Status States

Typical operational states:

- `active` — normal delivery  
- `onboarding` — setup in progress  
- `paused` — manual or safety pause  
- `error` — repeated failure requires recovery  
- `suppressed` — explicit stop (never auto-resume)  

Only engineering or support may change these states.

---

## Idempotency & Safety

### Goals
- Prevent duplicate deliveries
- Allow safe retries
- Enable bounded replay during recovery

### Rules
- Every delivery cycle must be idempotent
- Vendor jobs must be replay-safe
- Email sends must enforce deduplication
- CRM commits occur once per cycle

If idempotency cannot be guaranteed, the design must be revised.

---

## Failure Handling Strategy

### Common Failure Classes
- HubSpot timeouts or rate limits  
- Schema mismatch  
- Partial variable availability  
- Vendor generation failure  
- Vendor render failure  
- Email send failure  

### Recovery Rules
- Retry transient failures with backoff  
- Use cached snapshots when safe  
- Apply defaults for non-critical variables  
- Pause silently for critical failures  
- Alert internally only  

**Sarah is never asked to fix anything.**

---

## Observability & Internal Signals

Required internal metrics:
- Delivery success rate
- Time-to-delivery
- Failure rate by class
- Vendor latency and error rates
- Bounce and suppression counts

System health is **never surfaced to the user**.

---

## Governance & Access Control

### Who Can Touch What

- **n8n:** Read/write scoped CC properties  
- **Support:** Read + pause/suppress  
- **Sales:** Lifecycle stage only  
- **Marketing:** No delivery properties  
- **User:** No access  

This prevents accidental corruption and trust erosion.

---

## Scaling Rules (Non-Optional)

To scale safely:
- One contact = one delivery stream  
- One shared delivery spine  
- No per-user workflow cloning  
- No manual reconciliation  
- No human dependency for continuity  

If a change requires manual cleanup, it will fail at scale.

---

## Change Management

Before shipping changes to:
- CRM schema
- Prompt variables
- Cadence rules
- Delivery logic

Required artifacts:
- Updated schema documentation  
- Prompt version log  
- n8n ↔ HubSpot contract  
- Backward compatibility notes  

If documentation is missing, the change does not ship.

---

## Strategic Throughline

This system exists so that:

- Sarah can disappear  
- Engineers can sleep  
- Leadership can trust output  
- Content keeps shipping  

Sarah never experiences “the system.”  
She experiences:

> **“This still showed up.”**

That is the only metric that matters.
