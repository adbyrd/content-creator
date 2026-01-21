![The Content Creator SKOOL Community](https://static.wixstatic.com/media/155164_0b85cbab96be4a028be891d92e7dcc5e~mv2.png)  
# The Content Creator (CC)

The official repository for the Content Creator automated system.  
**The Content Creator** is a production-grade, automated content delivery system designed to generate and deliver short-form content reliably, at scale, without manual intervention.

This repository is the **authoritative source of truth** for how the system is designed, governed, and evolved.

---

## Executive Summary

- **What this is:**  
  A contract-driven automation system that turns structured inputs into daily, deliverable-ready content.

- **What it is not:**  
  A content management system, a growth experiment, or a creator toolset.

- **Core principle:**  
  *Execution must scale without vigilance, heroics, or tribal knowledge.*

Missed delivery damages trust more than bad content. This system is designed accordingly.

---

## System Philosophy

The Content Creator is built on four non-negotiable truths:

1. **Email is the product**  
   Everything upstream exists to support reliable delivery.

2. **HubSpot is system memory**  
   All state, lifecycle, and eligibility logic lives there.

3. **n8n is the operator, not the brain**  
   It executes deterministic workflows against defined contracts.

4. **Vendors are interchangeable**  
   No vendor is allowed to become a single point of failure.

---

## High-Level Architecture


Writes to HubSpot occur **only after successful downstream execution**.  
There are **no optimistic writes**.

---

## Repository Structure (Intent-Based)

| Area | Purpose |
|----|----|
| `contracts/` | Canonical schemas, enums, mappings, and invariants |
| `workflows/` | Versioned n8n workflows (JSON, deterministic exports only) |
| `services/` | Ingest, generation, orchestration, and delivery logic |
| `docs/` | Executive docs, system design, runbooks, and operations |
| `config/` | Environment-safe configuration and platform guardrails |
| `tooling/` | Validation, export, and governance automation |
| `examples/` | Sanitized payloads and Postman collections |
| `.github/` | CI, PR enforcement, and repo governance |

If a change affects behavior, it must be reflected in **contracts**, **workflows**, and **documentation**.

---

## Governance Model

This repository is governed as **critical infrastructure**.

### Change Rules
- All schema changes are versioned.
- All workflows are reviewed as code.
- All vendor integrations are documented as contracts.
- No per-user logic branches are permitted.

### Explicitly Forbidden
- Committing secrets or tokens (see `.gitignore`)
- Editing workflows directly in production
- Shipping undocumented behavior changes
- “Temporary” bypasses of validation or delivery checks

---

## Environment Separation

The system supports multiple environments (dev, prod) with:
- Identical structure
- Different credentials
- Identical behavior guarantees

Environment-specific values **never** live in source control.  
Only `.env.example` files are permitted.

---

## Reliability & Failure Handling

Failure is assumed.

This repository includes:
- Incident playbooks
- Error taxonomies
- Recovery paths
- Delivery integrity rules

When something breaks, the system must:
1. Fail loudly
2. Fail deterministically
3. Fail without corrupting state

---

## Who This Repository Is For

Primary audience:
- Platform engineers
- Automation engineers
- Security reviewers
- Technical leadership

Secondary audience:
- Operators learning the system
- External teams studying the architecture
- Auditors reviewing controls and intent

This repository is **not** optimized for beginners.

---

## Contribution Expectations

Before submitting a change, you should be able to answer:

- What contract changed?
- What behavior changed?
- What could break?
- How is rollback handled?

If you cannot answer those questions, the change is not ready.

See `CONTRIBUTING.md` for details.

---

## License

This repository is licensed for **inspection and education**.  
Usage, redistribution, or commercialization may be restricted.

See `LICENSE` for full terms.

---

## Final Note

This repository exists to prevent:
- Platform drift
- Founder-dependent knowledge
- Silent failures
- Scaling through vigilance

If something feels “slower” here, it is because reliability is winning.

That is intentional.
