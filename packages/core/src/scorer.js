export const LEVEL_POINTS = { high: 25, medium: 15, low: 5 };

export function computeScore(findings) {
  return findings.reduce((sum, f) => sum + (LEVEL_POINTS[f.level] || 0), 0);
}

export function classifyRisk(score) {
  if (score <= 20) return "SAFE";
  if (score <= 40) return "MEDIUM";
  return "HIGH";
}

export function summarize(findings) {
  return {
    critical: findings.filter(f => f.level === "high").length,
    warning:  findings.filter(f => f.level === "medium").length,
    info:     findings.filter(f => f.level === "low").length,
  };
}
