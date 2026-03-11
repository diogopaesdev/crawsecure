import fs   from "fs";
import os   from "os";
import path from "path";

export const CONFIG_DIR        = path.join(os.homedir(), ".crawsecure");
export const CONFIG_PATH       = path.join(CONFIG_DIR, "auth.json");
export const GUEST_USAGE_PATH  = path.join(CONFIG_DIR, "guest-usage.json");
export const GUEST_SCAN_LIMIT  = 3;

/** @returns {{ token: string, name: string, plan: string } | null} */
export function getStoredAuth() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** @param {{ token: string, name: string, plan: string }} auth */
export function saveAuth(auth) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(auth, null, 2), { mode: 0o600 });
}

export function clearAuth() {
  try {
    fs.unlinkSync(CONFIG_PATH);
  } catch {
    // already gone — that's fine
  }
}

/** @returns {number} */
export function getGuestCount() {
  try {
    const raw = fs.readFileSync(GUEST_USAGE_PATH, "utf8");
    return JSON.parse(raw).count ?? 0;
  } catch {
    return 0;
  }
}

/** @returns {number} incremented count */
export function incrementGuestCount() {
  const next = getGuestCount() + 1;
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(GUEST_USAGE_PATH, JSON.stringify({ count: next }));
  return next;
}

/** @returns {{ Authorization: string } | {}} */
export function getAuthHeaders() {
  const auth = getStoredAuth();
  if (!auth?.token) return {};
  return { Authorization: `Bearer ${auth.token}` };
}
