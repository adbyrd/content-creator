// tests/integration/n8n.snapshot.spec.ts
/**
 * Integration snapshot tests for n8n workflow artifacts.
 *
 * Purpose:
 * - Detect accidental drift in exported n8n workflows
 * - Enforce contract-required metadata
 * - Ensure workflows remain deterministic and versioned
 *
 * These tests do NOT execute workflows.
 * They validate structure, invariants, and snapshots.
 */

import fs from "fs";
import path from "path";

type WorkflowJson = {
  name: string;
  version?: number;
  meta?: Record<string, any>;
  nodes?: any[];
  connections?: Record<string, any>;
};

const EXPORT_DIR = path.resolve(process.cwd(), "workflows/n8n/export");

const REQUIRED_WORKFLOWS = [
  "cc_lead_ingest_wix.v1.json",
  "cc_skool_member_sync.v1.json",
  "cc_delivery_spine.v1.json",
];

const REQUIRED_META_FIELDS = [
  "cc.workflow_name",
  "cc.workflow_version",
  "cc.contract_version",
  "cc.environment",
];

function readWorkflow(file: string): WorkflowJson {
  const fullPath = path.join(EXPORT_DIR, file);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Workflow file missing: ${file}`);
  }

  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

describe("n8n workflow snapshot integrity", () => {
  test("export directory exists", () => {
    expect(fs.existsSync(EXPORT_DIR)).toBe(true);
  });

  test.each(REQUIRED_WORKFLOWS)(
    "required workflow present: %s",
    (file) => {
      const fullPath = path.join(EXPORT_DIR, file);
      expect(fs.existsSync(fullPath)).toBe(true);
    },
  );

  test.each(REQUIRED_WORKFLOWS)(
    "workflow %s has required top-level structure",
    (file) => {
      const wf = readWorkflow(file);

      expect(typeof wf.name).toBe("string");
      expect(Array.isArray(wf.nodes)).toBe(true);
      expect(typeof wf.connections).toBe("object");
    },
  );

  test.each(REQUIRED_WORKFLOWS)(
    "workflow %s contains required contract metadata",
    (file) => {
      const wf = readWorkflow(file);

      expect(wf.meta).toBeDefined();

      for (const field of REQUIRED_META_FIELDS) {
        expect(wf.meta?.[field]).toBeDefined();
      }
    },
  );

  test.each(REQUIRED_WORKFLOWS)(
    "workflow %s has versioned filename matching workflow name",
    (file) => {
      const wf = readWorkflow(file);

      // cc_delivery_spine.v1.json → cc_delivery_spine
      const expectedName = file.replace(/\.v\d+\.json$/, "");
      expect(wf.name).toBe(expectedName);
    },
  );

  test.each(REQUIRED_WORKFLOWS)(
    "workflow %s has no embedded credentials",
    (file) => {
      const raw = fs.readFileSync(path.join(EXPORT_DIR, file), "utf-8");

      // Guardrails against common credential leaks
      expect(raw).not.toMatch(/Authorization/i);
      expect(raw).not.toMatch(/Bearer\s+/i);
      expect(raw).not.toMatch(/api[_-]?key/i);
      expect(raw).not.toMatch(/token"\s*:/i);
    },
  );

  test.each(REQUIRED_WORKFLOWS)(
    "workflow %s snapshot matches stored snapshot",
    (file) => {
      const wf = readWorkflow(file);

      /**
       * Snapshot scope:
       * - Full JSON structure
       * - Ordering preserved by export
       *
       * Intent:
       * - Any change here is a deployment event
       */
      expect(wf).toMatchSnapshot();
    },
  );
});