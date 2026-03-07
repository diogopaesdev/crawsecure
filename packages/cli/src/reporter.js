const LEVEL_ICON = { high: "🔴", medium: "🟡", low: "🟢" };

export function formatReport(findings, score, risk) {
  const lines = ["", `🚨 Security signals found: ${findings.length}`, ""];

  for (const f of findings) {
    const icon = LEVEL_ICON[f.level] ?? "⚪";
    lines.push(`  ${icon} [${f.level.toUpperCase()}] ${f.message} — ${f.file}`);
  }

  lines.push("", `📊 Risk score: ${score} → ${risk}`);
  return lines.join("\n");
}

/**
 * Print a header line showing the logged-in user.
 * @param {{ name: string, plan: string } | null} auth
 */
export function formatHeader(auth) {
  if (!auth) return "";
  const planLabel = auth.plan === "pro" ? "PRO" : "FREE";
  const inner     = `  CrawSecure v2  ·  @${auth.name}  [${planLabel}]`;
  const width     = Math.max(inner.length + 2, 48);
  const bar       = "─".repeat(width);
  return `┌${bar}┐\n│${inner.padEnd(width)}│\n└${bar}┘`;
}

/**
 * Format a successful cloud save result.
 * @param {{ scanId: string, plan: string, remaining: number | null, limit: number | null }} opts
 */
export function formatSaveResult({ scanId, plan, remaining, limit }) {
  const url   = `https://crawsecure.com/dashboard/${scanId}`;
  const lines = [`\n  Scan saved  →  ${url}`];

  if (plan === "pro") {
    lines.push("  PRO · unlimited scans");
  } else {
    const used = limit !== null ? (limit - (remaining ?? 0)) : "?";
    lines.push(`  Free · ${used} / ${limit ?? 10} scans this month`);
    if (remaining !== null && remaining <= 3) {
      lines.push(`  Upgrade → https://crawsecure.com/upgrade`);
    }
  }

  return lines.join("\n");
}

/**
 * Builds the crawsecure.json payload.
 * Contains only aggregated signals — no file contents, no code snippets.
 */
export function toOutputJSON({ findings, summary, score, risk, filesScanned }) {
  return {
    version:      "2.0",
    generatedAt:  new Date().toISOString(),
    summary: {
      filesScanned,
      ...summary,
      score,
      risk,
    },
    rulesTriggered: [...new Set(findings.map(f => f.ruleId))],
    findings,
  };
}
