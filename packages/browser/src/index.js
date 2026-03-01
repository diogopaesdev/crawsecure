// Browser entry point for CrawSecure.
// All analysis runs locally — no file content is ever sent to a server.

export {
  ALL_PATTERNS,
  DANGEROUS_PATTERNS,
  SENSITIVE_FILE_PATTERNS,
  shouldScan,
  scanContent,
  scanFiles,
  computeScore,
  classifyRisk,
  summarize,
} from "@crawsecure/core";

/**
 * Reads a browser File object into { name, content }.
 * @param {File} file
 * @returns {Promise<{name: string, content: string}>}
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve({ name: file.name, content: e.target.result });
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsText(file);
  });
}

/**
 * Reads a FileList or File[] into [{ name, content }].
 * @param {FileList | File[]} fileList
 * @returns {Promise<Array<{name: string, content: string}>>}
 */
export function readFileList(fileList) {
  return Promise.all(Array.from(fileList).map(readFile));
}

/**
 * Full local scan pipeline for browser usage.
 * Accepts browser File objects — nothing is uploaded or stored.
 *
 * @param {FileList | File[]} fileList
 * @returns {Promise<{
 *   findings: Array<{ruleId, level, message, file}>,
 *   score: number,
 *   risk: "SAFE" | "MEDIUM" | "HIGH",
 *   summary: {critical: number, warning: number, info: number},
 *   rulesTriggered: string[],
 *   filesScanned: number,
 * }>}
 */
export async function scanBrowserFiles(fileList) {
  const { scanFiles, computeScore, classifyRisk, summarize } = await import("@crawsecure/core");

  const files    = await readFileList(fileList);
  const findings = scanFiles(files);
  const score    = computeScore(findings);
  const risk     = classifyRisk(score);
  const summary  = summarize(findings);
  const rulesTriggered = [...new Set(findings.map(f => f.ruleId))];

  return { findings, score, risk, summary, rulesTriggered, filesScanned: files.length };
}

/**
 * Builds the crawsecure.json structure from a scan result.
 * This is generated client-side — never on the server.
 *
 * @param {{ findings, summary, score, risk, filesScanned }} result
 * @returns {object}
 */
export function buildOutputJSON({ findings, summary, score, risk, filesScanned }) {
  return {
    version:     "2.0",
    generatedAt: new Date().toISOString(),
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
