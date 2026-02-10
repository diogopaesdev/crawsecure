const LEVEL_ICON = {
  high: "🔴",
  medium: "🟡",
  low: "🟢",
};

function scoreFromFindings(findings) {
  const points = { high: 25, medium: 15, low: 5 };
  return findings.reduce((sum, f) => sum + (points[f.level] || 0), 0);
}

function classifyRisk(score) {
  if (score <= 20) return "SAFE";
  if (score <= 40) return "MEDIUM";
  return "HIGH";
}

export function formatReport(findings) {
  const score = scoreFromFindings(findings);
  const risk = classifyRisk(score);

  const lines = [
    "",
    `🚨 Security signals found: ${findings.length}`,
    "",
  ];

  for (const f of findings) {
    const icon = LEVEL_ICON[f.level] || "⚪";
    lines.push(`  ${icon} [${f.level.toUpperCase()}] ${f.message} — ${f.file}`);
  }

  lines.push("");
  lines.push(`📊 Risk score: ${score} → ${risk}`);

  return lines.join("\n");
}

export function toJSON(skillName, findings) {
  const score = scoreFromFindings(findings);
  return {
    skill: skillName,
    risk: classifyRisk(score),
    score,
    findings,
  };
}
