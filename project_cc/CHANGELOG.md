# Changelog — The Content Creator (CC)

All notable changes to this repository are documented in this file.

This project follows **intentional, audited change management**.  
Undocumented behavior changes are treated as defects.

---

## Changelog Principles

- Every entry answers **what changed** and **why it matters**
- Breaking changes are explicit and unavoidable to miss
- Changes are grouped by operational impact, not by effort
- Dates reflect **merge to main**, not authoring time

If a change affects production behavior, it must appear here.

---

## [Unreleased]

### Added
- Initial repository governance artifacts
- Contract-first system documentation
- Versioned workflow structure and export conventions

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

---

## [1.0.0] — 2026-01-22

### Added
- Initial public release of **The Content Creator** system
- Contract-driven repository architecture
- Versioned HubSpot schemas and lifecycle enums
- Deterministic n8n workflow exports
- Environment-safe configuration templates
- Governance files: CODEOWNERS, CONTRIBUTING, LICENSE, SECURITY
- Operational runbooks and incident playbooks

### Changed
- N/A (initial release)

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- Enforced secret exclusion via `.gitignore`
- Explicit environment separation via `.env.example`
- Ownership enforcement on high-risk directories

---

## Change Classification Legend

- **Added** — New functionality or artifacts
- **Changed** — Behavioral modifications that preserve contracts
- **Deprecated** — Supported now, removed in a future release
- **Removed** — Fully removed functionality or artifacts
- **Fixed** — Bug fixes with no contract impact
- **Security** — Changes addressing security posture or exposure

---

## Versioning Policy

- **MAJOR** — Breaking contract, schema, or delivery guarantees
- **MINOR** — Backward-compatible behavior improvements
- **PATCH** — Bug fixes, documentation, or internal refactors

Version numbers are intentional.  
There are no “silent” releases.

---

## Final Note

If a change is not documented here, it is considered **out of policy**.

Changelog accuracy is a release requirement, not an afterthought.
