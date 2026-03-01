export type ScanLevel  = "high" | "medium" | "low";
export type RiskLevel  = "SAFE" | "MEDIUM" | "HIGH";
export type ScanSource = "json" | "browser";

export interface Finding {
  ruleId:  string;
  level:   ScanLevel;
  message: string;
  file:    string;
}

export interface ScanSummary {
  critical: number;
  warning:  number;
  info:     number;
}

export interface ScanResult {
  source:        ScanSource;
  findings:      Finding[];
  score:         number;
  risk:          RiskLevel;
  summary:       ScanSummary;
  rulesTriggered: string[];
  filesScanned:  number;
  generatedAt?:  string;
}
