# Contributing to The Content Creator (CC)

Thank you for your interest in contributing to **The Content Creator**.

This repository is governed as **production infrastructure**, not a sandbox.  
Contributions are welcome only when they preserve reliability, auditability, and long-term system integrity.

If you are looking to experiment, prototype, or “move fast,” this is not the correct repository.

---

## Guiding Principles

All contributions must align with the following principles:

1. **Reliability over speed**
2. **Contracts before code**
3. **Explicit ownership**
4. **Deterministic behavior**
5. **No founder- or operator-dependent knowledge**

If a change introduces ambiguity, implicit behavior, or undocumented logic, it will be rejected.

---

## What You May Contribute

Acceptable contributions include:

- Documentation improvements or clarifications
- Bug fixes with clear root-cause analysis
- Schema or contract extensions (versioned)
- Workflow improvements that reduce risk or increase determinism
- Observability, validation, or safety enhancements
- Tests that increase coverage or failure confidence

All contributions must be intentional, reviewable, and reversible.

---

## What Is Explicitly Not Allowed

The following will be rejected without exception:

- Committing secrets, tokens, or credentials
- “Temporary” bypasses of validation, retries, or delivery checks
- Per-user or per-client logic branches
- Editing production workflows without versioning
- Shipping behavior changes without documentation updates
- Changes that rely on tribal knowledge to operate correctly

---

## Change Classification (Required)

Every pull request must clearly state which class of change it represents:

### 1. Documentation-Only  
No behavioral impact. No runtime changes.

### 2. Non-Breaking Behavioral Change  
Improves behavior without changing contracts or guarantees.

### 3. Breaking Change  
Alters contracts, schemas, workflows, or delivery guarantees.  
**Must be versioned and explicitly approved.**

If you cannot classify your change, it is not ready.

---

## Required Before Opening a Pull Request

Before submitting a PR, you must be able to answer:

- What contract changed?
- What behavior changed?
- What could break?
- How is rollback handled?
- How is this change tested?

If any answer is “it depends” or “it should be fine,” stop.

---

## Pull Request Requirements

Every pull request must include:

- A clear, descriptive title
- A summary of intent (not implementation)
- Explicit risks and mitigations
- References to updated documentation or contracts
- Tests or validation steps, where applicable

PRs that fail CI, violate ownership rules, or bypass governance will not be merged.

---

## Ownership & Review

This repository uses **CODEOWNERS** to enforce review boundaries.

Certain areas (contracts, workflows, delivery, CI) are **high-risk** and require multiple reviewers.  
Lack of availability is not a reason to bypass review.

No self-approval on high-risk changes.

---

## Environment & Secrets Policy

- Real environment values **never** belong in this repository
- `.env.example` is documentation only
- All secrets must live in approved secret managers
- Any suspected secret exposure must be reported immediately

See `SECURITY.md` for disclosure procedures.

---

## Versioning & Releases

- Contracts and workflows are versioned explicitly
- Breaking changes require a changelog entry
- Releases are intentional, not incidental

If a change affects production behavior, it must be releasable on its own.

---

## Final Expectation

This repository exists to prevent:

- Silent failures
- Platform drift
- Knowledge silos
- Scaling through vigilance or heroics

If contributing here feels slower than expected, that is by design.

Reliability is winning.

---

## Questions

If you are unsure whether a change is appropriate, open an issue **before** writing code.

Unreviewed assumptions are the fastest path to rejection.
