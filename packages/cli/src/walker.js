import fs   from "fs";
import path from "path";
import { shouldScan } from "@crawsecure/core";

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".next"]);

function walk(folder) {
  const files = [];
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) files.push(...walk(full));
    } else if (shouldScan(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Reads all scannable files from a directory.
 * @param {string} dir
 * @returns {Array<{name: string, content: string}>}
 */
export function readFiles(dir) {
  const resolved = path.resolve(dir);

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`"${resolved}" is not a valid directory.`);
  }

  return walk(resolved).map(filePath => ({
    name:    path.relative(resolved, filePath),
    content: fs.readFileSync(filePath, "utf8"),
  }));
}
