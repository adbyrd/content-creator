# Security Policy — The Content Creator (CC)

Security is a first-class requirement of The Content Creator system.  
This repository is treated as **critical infrastructure**, not an experimental project.

All contributors, reviewers, and observers are expected to act accordingly.

---

## Supported Scope

Security concerns apply to:

- Source code
- Workflow definitions (n8n exports)
- Schemas, contracts, and configuration templates
- CI/CD workflows
- Documentation that influences operational behavior

This includes **misconfigurations**, **unsafe defaults**, and **governance gaps**, not just code vulnerabilities.

---

## Reporting a Security Issue

### DO NOT
- Open a public GitHub issue for security-related findings
- Share suspected vulnerabilities in discussions, PRs, or comments
- Attempt to exploit the system beyond minimal proof-of-concept

### DO
Report security issues **privately and responsibly**.

#### How to Report
Send a detailed report to the repository security contact including:

- Description of the issue
- Affected files, workflows, or contracts
- Potential impact and blast radius
- Steps to reproduce (if applicable)
- Any suggested mitigation (optional)

Reports should be made **as soon as the issue is discovered**.

---

## What Qualifies as a Security Issue

Examples include (but are not limited to):

- Exposure or mishandling of secrets or credentials
- Authentication or authorization weaknesses
- Unsafe workflow behavior that could corrupt system state
- Missing validation on inbound or outbound payloads
- Configuration patterns that could enable misuse or abuse
- CI/CD workflows that allow unauthorized execution or modification
- Documentation that encourages unsafe operational practices

If you are unsure, **report it anyway**.

---

## Response & Triage Process

Once a report is received:

1. **Acknowledgement** within a reasonable timeframe
2. **Initial triage** to assess severity and scope
3. **Containment** actions if immediate risk exists
4. **Remediation** via reviewed and auditable changes
5. **Documentation** of the fix and any required follow-up actions

Severity determines prioritization.  
Silence or delay does not indicate dismissal.

---

## Disclosure Policy

- Vulnerabilities are disclosed **only after remediation**
- Public disclosure timing is determined by the maintainers
- Credit may be given to reporters unless anonymity is requested
- No disclosure will include sensitive implementation details

Responsible disclosure protects users and the platform.

---

## Prohibited Activities

The following actions are not permitted:

- Attempting to access production systems or data
- Using leaked or guessed credentials
- Stress testing live infrastructure without authorization
- Social engineering attempts against contributors or operators
- Publishing exploit details without approval

Violations may result in revocation of access or legal action.

---

## Dependency & Supply Chain Security

- Third-party dependencies are reviewed intentionally
- Vendors are documented under `/contracts/vendors/`
- Automated dependency and security scans are enforced via CI
- Transitive risk is considered during review, not ignored

---

## Incident Handling Expectations

If you believe an active incident is occurring:

- Report immediately via the security contact
- Include time sensitivity and observed impact
- Do not attempt unilateral remediation

Incident response follows predefined runbooks located in:
`/docs/05_operations/incident-playbooks/`

---

## Final Note

Security is not a feature.  
It is an operational posture.

If something feels unsafe, undocumented, or ambiguous, treat it as a security concern until proven otherwise.
