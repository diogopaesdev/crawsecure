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
