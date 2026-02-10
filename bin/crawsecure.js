#!/usr/bin/env node

import { analyzePath } from "../src/analyzer.js";
import { formatReport } from "../src/reporter.js";

const target = process.argv[2] || ".";

console.log("🔍 CrawSecure running...");
console.log("Target:", target);

const results = analyzePath(target);

if (results.length === 0) {
  console.log("\n✅ No security signals found. Skill looks safe.");
  process.exit(0);
}

console.log(formatReport(results));

const hasHigh = results.some(r => r.level === "high");
if (hasHigh) process.exit(2);
