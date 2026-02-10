import fs from "fs";
import path from "path";
import { DANGEROUS_PATTERNS, SENSITIVE_FILE_PATTERNS } from "./rules.js";

const SCAN_EXTENSIONS = [".js", ".ts", ".json", ".sh"];
const SKIP_DIRS = ["node_modules", ".git", "dist", ".next"];

function shouldScan(file) {
  return SCAN_EXTENSIONS.includes(path.extname(file));
}

function walk(folder) {
  const files = [];
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(entry.name)) files.push(...walk(full));
    } else if (shouldScan(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

export function analyzePath(dir) {
  const resolvedDir = path.resolve(dir);

  if (!fs.existsSync(resolvedDir) || !fs.statSync(resolvedDir).isDirectory()) {
    console.error(`Error: "${resolvedDir}" is not a valid directory.`);
    process.exit(1);
  }

  const findings = [];
  const allPatterns = [...DANGEROUS_PATTERNS, ...SENSITIVE_FILE_PATTERNS];

  for (const filePath of walk(resolvedDir)) {
    const content = fs.readFileSync(filePath, "utf8");
    const relative = path.relative(resolvedDir, filePath);

    for (const pattern of allPatterns) {
      if (pattern.regex.test(content)) {
        findings.push({
          level: pattern.level,
          message: pattern.message,
          file: relative,
        });
      }
    }
  }

  return findings;
}
