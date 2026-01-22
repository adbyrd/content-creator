# CODEOWNERS — The Content Creator (CC)
#
# Governance intent:
# - High-risk areas require explicit review by platform/security owners.
# - Prevents drift by enforcing ownership at the directory boundary.
#
# NOTE:
# Replace the placeholder teams/users below with your real GitHub org teams.
# Recommended teams:
#   @adbyrd/cc-platform
#   @adbyrd/cc-security
#   @adbyrd/cc-automation
#   @adbyrd/cc-deliverability
#   @adbyrd/cc-qa

###############################################################################
# Default ownership (everything requires review by platform)
###############################################################################
*                                   @adbyrd/cc-platform

###############################################################################
# Repo governance files (strict)
###############################################################################
/.github/                            @adbyrd/cc-platform @adbyrd/cc-security
/.github/workflows/                  @adbyrd/cc-platform @adbyrd/cc-security
/SECURITY.md                         @adbyrd/cc-security @adbyrd/cc-platform
/CODEOWNERS                          @adbyrd/cc-platform @adbyrd/cc-security
/LICENSE                             @adbyrd/cc-platform
/CONTRIBUTING.md                     @adbyrd/cc-platform
/CHANGELOG.md                        @adbyrd/cc-platform
/.gitignore                          @adbyrd/cc-platform @adbyrd/cc-security
/.env.example                        @adbyrd/cc-platform @adbyrd/cc-security
/.editorconfig                       @adbyrd/cc-platform

###############################################################################
# Contracts (system truth) — changes here are breaking by default
###############################################################################
/contracts/                          @adbyrd/cc-platform @adbyrd/cc-security @adbyrd/cc-qa
/contracts/hubspot/                  @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/contracts/hubspot/enums/            @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/contracts/hubspot/properties/       @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/contracts/n8n/                      @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/contracts/email/                    @adbyrd/cc-platform @adbyrd/cc-deliverability @adbyrd/cc-qa
/contracts/vendors/                  @adbyrd/cc-platform @adbyrd/cc-security

###############################################################################
# Workflows (execution spine) — require automation + platform review
###############################################################################
/workflows/                          @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/workflows/n8n/                      @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/workflows/n8n/export/               @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa

###############################################################################
# Services (runtime behavior)
###############################################################################
/services/                           @adbyrd/cc-platform @adbyrd/cc-automation
/services/ingest/                    @adbyrd/cc-automation @adbyrd/cc-qa
/services/orchestration/             @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-qa
/services/generation/                @adbyrd/cc-platform @adbyrd/cc-automation
/services/delivery/                  @adbyrd/cc-platform @adbyrd/cc-deliverability @adbyrd/cc-qa

###############################################################################
# Configuration (risk: environment drift / safety controls)
###############################################################################
/config/                             @adbyrd/cc-platform @adbyrd/cc-security
/config/environments/                @adbyrd/cc-platform @adbyrd/cc-security
/config/feature-flags.yaml           @adbyrd/cc-platform @adbyrd/cc-security @adbyrd/cc-qa
/config/rate-limits.yaml             @adbyrd/cc-platform @adbyrd/cc-security

###############################################################################
# Tooling (build/validation scripts)
###############################################################################
/tooling/                            @adbyrd/cc-platform
/tooling/scripts/                    @adbyrd/cc-platform
/tooling/schemas/                    @adbyrd/cc-platform @adbyrd/cc-qa

###############################################################################
# Examples & fixtures (must remain sanitized)
###############################################################################
/examples/                           @adbyrd/cc-platform @adbyrd/cc-security @adbyrd/cc-qa
/examples/postman/                   @adbyrd/cc-platform @adbyrd/cc-security
/workflows/n8n/fixtures/             @adbyrd/cc-platform @adbyrd/cc-qa

###############################################################################
# Docs / Runbooks (operational ownership)
###############################################################################
/docs/                               @adbyrd/cc-platform
/docs/05_operations/                 @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-deliverability
/docs/05_operations/incident-playbooks/  @adbyrd/cc-platform @adbyrd/cc-automation @adbyrd/cc-deliverability
