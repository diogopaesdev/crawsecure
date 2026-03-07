#!/usr/bin/env node

import fs from "fs";
import { scanFiles, computeScore, classifyRisk, summarize } from "@crawsecure/core";
import { readFiles }        from "../src/walker.js";
import { formatReport, toOutputJSON, formatHeader, formatSaveResult } from "../src/reporter.js";
import { getStoredAuth, clearAuth, getAuthHeaders } from "../src/auth.js";
import { runLogin }         from "../src/github-device-flow.js";

const BASE_URL = process.env.CRAWSECURE_URL ?? "https://crawsecure.com";

// ── Subcommand routing ──────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const command = args[0];

if (command === "login") {
  await runLogin();
  process.exit(0);
}

if (command === "logout") {
  clearAuth();
  console.log("\n  Logged out. Your local credentials have been removed.\n");
  process.exit(0);
}

if (command === "whoami") {
  const auth = getStoredAuth();
  if (!auth) {
    console.log("\n  Not logged in. Run `crawsecure login`.\n");
    process.exit(1);
  }
  try {
    const res  = await fetch(`${BASE_URL}/api/me`, { headers: getAuthHeaders() });
    const data = await res.json();
    const planLabel  = data.plan === "pro" ? "PRO" : "FREE";
    const usageLine  = data.plan === "pro"
      ? "unlimited scans"
      : `${data.scansThisMonth ?? 0} / ${data.limit ?? 10} scans this month`;
    console.log(`\n  @${data.name ?? auth.name}  [${planLabel}]  ·  ${usageLine}\n`);
  } catch {
    console.error("  Failed to reach CrawSecure. Check your connection.");
    process.exit(1);
  }
  process.exit(0);
}

// ── Scan mode ───────────────────────────────────────────────────────────────

const target     = args.find(a => !a.startsWith("-")) ?? ".";
const outputIdx  = args.indexOf("--output");
const outputFile = outputIdx !== -1 ? args[outputIdx + 1] : null;

const auth = getStoredAuth();

// Print header if logged in
if (auth) {
  console.log(formatHeader(auth));
  console.log("");
} else {
  console.log("🔍 CrawSecure v2 running...");
}

console.log("Target:", target);

let files;
try {
  files = readFiles(target);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

const findings = scanFiles(files);

// ── Build result ─────────────────────────────────────────────────────────────

const score   = computeScore(findings);
const risk    = classifyRisk(score);
const summary = summarize(findings);

// ── Output ───────────────────────────────────────────────────────────────────

if (findings.length === 0) {
  console.log("\n  No security signals found. Skill looks safe.");
} else {
  console.log(formatReport(findings, score, risk));
}

if (outputFile) {
  const payload = toOutputJSON({ findings, summary, score, risk, filesScanned: files.length });
  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2));
  console.log(`\n  Report saved: ${outputFile}`);
}

// ── Cloud save (if authenticated) ────────────────────────────────────────────

if (auth) {
  try {
    const scanBody = {
      summary:        { critical: summary.critical ?? 0, warning: summary.warning ?? 0, info: summary.info ?? 0 },
      score,
      risk,
      rulesTriggered: [...new Set(findings.map(f => f.ruleId))],
      filesScanned:   files.length,
    };

    const saveRes = await fetch(`${BASE_URL}/api/scans`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body:    JSON.stringify(scanBody),
    });

    if (saveRes.status === 201) {
      const { scanId } = await saveRes.json();

      // Fetch usage for display
      let usageData = null;
      try {
        const usageRes = await fetch(`${BASE_URL}/api/me`, { headers: getAuthHeaders() });
        if (usageRes.ok) usageData = await usageRes.json();
      } catch { /* non-fatal */ }

      console.log(formatSaveResult({
        scanId,
        plan:      usageData?.plan ?? auth.plan,
        remaining: usageData?.remaining ?? null,
        limit:     usageData?.limit     ?? null,
      }));
    } else if (saveRes.status === 429) {
      console.log("\n  Monthly scan limit reached. Upgrade at https://crawsecure.com/upgrade");
    } else {
      console.log(`\n  Could not save scan (${saveRes.status}). Run \`crawsecure login\` to re-authenticate.`);
    }
  } catch (err) {
    console.log("\n  Could not reach CrawSecure to save scan.");
  }
} else {
  console.log(`\n  Run \`crawsecure login\` to save scans to your account.`);
}

if (risk === "HIGH") process.exit(2);
