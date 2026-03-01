// Browser-compatible scanning engine — no fs, no path, no Node.js APIs.
// Receives file contents as strings and returns findings.

import { ALL_PATTERNS } from "./rules.js";

const SCAN_EXTENSIONS = new Set([".js", ".ts", ".json", ".sh"]);

export function shouldScan(filename) {
  const dot = filename.lastIndexOf(".");
  return dot !== -1 && SCAN_EXTENSIONS.has(filename.slice(dot));
}

/**
 * Scans a single file's content against all rules.
 * @param {string} filename - relative path used only for reporting
 * @param {string} content  - raw file content (never stored, never sent)
 * @returns {Array<{ruleId, level, message, file}>}
 */
export function scanContent(filename, content) {
  const findings = [];
  for (const pattern of ALL_PATTERNS) {
    if (pattern.regex.test(content)) {
      findings.push({
        ruleId:  pattern.id,
        level:   pattern.level,
        message: pattern.message,
        file:    filename,
      });
    }
  }
  return findings;
}

/**
 * Scans a list of files.
 * @param {Array<{name: string, content: string}>} files
 * @returns {Array<{ruleId, level, message, file}>}
 */
export function scanFiles(files) {
  return files.flatMap(({ name, content }) =>
    shouldScan(name) ? scanContent(name, content) : []
  );
}
