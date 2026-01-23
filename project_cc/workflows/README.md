# n8n Workflows — CC / ACC

This directory contains the **authoritative n8n workflow artifacts** that operate the Content Creator (CC) and Advanced Content Creator (ACC) systems.

n8n is treated as an **execution engine**, not a playground.
Every workflow here is expected to run unattended, safely, and repeatedly—even if the creator disappears.

---

## Purpose of This Directory

- Hold **exported, deployable n8n workflows** (`.json`)
- Enforce **contracts, guardrails, and invariants**
- Enable **repeatable delivery at scale** (hundreds → thousands of creators)
- Prevent silent drift, optimistic writes, and brittle logic

If a workflow exists here, it is assumed to be **production-grade or production-adjacent**.

---

## Directory Structure

```text
workflows/n8n/
├── export/
│   ├── cc_lead_ingest_wix.v1.json
│   ├── cc_skool_member_sync.v1.json
│   └── cc_delivery_spine.v1.json
└── README.md
