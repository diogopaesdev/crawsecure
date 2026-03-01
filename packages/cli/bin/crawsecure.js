#!/usr/bin/env node

import fs from "fs";
import { scanFiles, computeScore, classifyRisk, summarize } from "@crawsecure/core";
import { readFiles }                                         from "../src/walker.js";
import { formatReport, toOutputJSON }                        from "../src/reporter.js";

// ── Arg parsing ────────────────────────────────────────────────────────────
const args       = process.argv.slice(2);
const target     = args.find(a => !a.startsWith("-")) ?? ".";
const outputIdx  = args.indexOf("--output");
const outputFile = outputIdx !== -1 ? args[outputIdx + 1] : null;

// ── Scan ───────────────────────────────────────────────────────────────────
console.log("🔍 CrawSecure v2 running...");
console.log("Target:", target);

let files;
try {
  files = readFiles(target);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

const findings = scanFiles(files);

// ── Build result ───────────────────────────────────────────────────────────
const score   = computeScore(findings);
const risk    = classifyRisk(score);
const summary = summarize(findings);

// ── Output ─────────────────────────────────────────────────────────────────
if (findings.length === 0) {
  console.log("\n✅ No security signals found. Skill looks safe.");
} else {
  console.log(formatReport(findings, score, risk));
}

if (outputFile) {
  const payload = toOutputJSON({ findings, summary, score, risk, filesScanned: files.length });
  fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2));
  console.log(`\n📁 Report saved: ${outputFile}`);
}

console.log(`\n🌐 Visualize at → https://crawsecure.dev/analyze`);

if (risk === "HIGH") process.exit(2);
