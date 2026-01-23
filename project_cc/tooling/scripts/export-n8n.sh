#!/usr/bin/env bash
# tooling/scripts/export-n8n.sh
#
# Purpose:
# Export canonical n8n workflows from a running n8n instance into this repository.
#
# This script enforces:
# - Versioned workflow exports only
# - Deterministic filenames
# - No secrets committed
#
# Assumptions:
# - n8n is running and reachable
# - N8N_API_URL and N8N_API_KEY are provided via env or secret manager
#
# Usage:
#   ./tooling/scripts/export-n8n.sh
#
# Optional:
#   WORKFLOW_IDS="12,34,56" ./tooling/scripts/export-n8n.sh

set -euo pipefail

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------

N8N_API_URL="${N8N_API_URL:-http://localhost:5678/api/v1}"
N8N_API_KEY="${N8N_API_KEY:-}"

EXPORT_DIR="workflows/n8n/export"
TMP_DIR=".tmp/n8n-export"

REQUIRED_WORKFLOWS=(
  "cc_lead_ingest_wix"
  "cc_skool_member_sync"
  "cc_delivery_spine"
)

# -------------------------------------------------------------------
# Safety checks
# -------------------------------------------------------------------

if [[ -z "$N8N_API_KEY" ]]; then
  echo "❌ N8N_API_KEY is not set. Aborting."
  exit 1
fi

if [[ ! -d "$EXPORT_DIR" ]]; then
  echo "❌ Export directory not found: $EXPORT_DIR"
  exit 1
fi

mkdir -p "$TMP_DIR"

# -------------------------------------------------------------------
# Helpers
# -------------------------------------------------------------------

auth_header() {
  echo "Authorization: Bearer ${N8N_API_KEY}"
}

fetch_workflows() {
  curl -sS \
    -H "$(auth_header)" \
    "${N8N_API_URL}/workflows"
}

fetch_workflow_by_id() {
  local id="$1"
  curl -sS \
    -H "$(auth_header)" \
    "${N8N_API_URL}/workflows/${id}"
}

sanitize_export() {
  # Remove fields that should never be committed
  # (credentials, runtime-only metadata)
  jq '
    del(
      .id,
      .createdAt,
      .updatedAt,
      .active,
      .credentials,
      .pinData
    )
  '
}

# -------------------------------------------------------------------
# Fetch workflow list
# -------------------------------------------------------------------

echo "📡 Fetching workflows from n8n…"
WORKFLOWS_JSON="$(fetch_workflows)"

if [[ -z "$WORKFLOWS_JSON" ]]; then
  echo "❌ Failed to fetch workflows."
  exit 1
fi

# -------------------------------------------------------------------
# Export workflows
# -------------------------------------------------------------------

echo "📦 Exporting workflows…"

IFS=',' read -ra FILTER_IDS <<< "${WORKFLOW_IDS:-}"

for name in "${REQUIRED_WORKFLOWS[@]}"; do
  echo "→ Processing workflow: $name"

  WF_ID="$(echo "$WORKFLOWS_JSON" | jq -r --arg NAME "$name" '
    .data[]
    | select(.name == $NAME)
    | .id
  ')"

  if [[ -z "$WF_ID" || "$WF_ID" == "null" ]]; then
    echo "⚠️  Workflow not found in n8n: $name"
    continue
  fi

  if [[ ${#FILTER_IDS[@]} -gt 0 ]]; then
    if [[ ! " ${FILTER_IDS[*]} " =~ " ${WF_ID} " ]]; then
      echo "   Skipping (not in WORKFLOW_IDS filter)"
      continue
    fi
  fi

  RAW_JSON="$(fetch_workflow_by_id "$WF_ID")"

  if [[ -z "$RAW_JSON" ]]; then
    echo "❌ Failed to fetch workflow ID $WF_ID"
    continue
  fi

  VERSION="$(echo "$RAW_JSON" | jq -r '.meta["cc.workflow_version"] // "0.0.0"')"
  MAJOR_VERSION="$(echo "$VERSION" | cut -d. -f1)"

  OUT_FILE="${EXPORT_DIR}/${name}.v${MAJOR_VERSION}.json"

  echo "   ↳ Exporting to ${OUT_FILE}"

  echo "$RAW_JSON" \
    | sanitize_export \
    | jq '.' \
    > "$OUT_FILE"

done

# -------------------------------------------------------------------
# Cleanup
# -------------------------------------------------------------------

rm -rf "$TMP_DIR"

echo "✅ n8n export complete."
echo
echo "Next steps:"
echo "- Review diffs carefully"
echo "- Confirm contract compliance"
echo "- Update CHANGELOG.md if behavior changed"
