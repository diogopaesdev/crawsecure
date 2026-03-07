import { saveAuth } from "./auth.js";

const BASE_URL = process.env.CRAWSECURE_URL ?? "https://crawsecure.com";

/** Fetch the GitHub OAuth client_id from the web backend. */
export async function fetchCliConfig() {
  const res = await fetch(`${BASE_URL}/api/auth/cli/config`);
  if (!res.ok) throw new Error(`Failed to fetch CLI config (${res.status})`);
  return res.json(); // { githubClientId }
}

/** POST github.com/login/device/code → { device_code, user_code, verification_uri, interval, expires_in } */
export async function requestDeviceCode(clientId) {
  const res = await fetch("https://github.com/login/device/code", {
    method:  "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body:    JSON.stringify({ client_id: clientId, scope: "read:user" }),
  });
  if (!res.ok) throw new Error(`GitHub device code request failed (${res.status})`);
  const data = await res.json();
  if (data.error) throw new Error(`GitHub error: ${data.error_description ?? data.error}`);
  return data;
}

/**
 * Poll github.com/login/oauth/access_token until the user authorizes.
 * Returns the access_token string.
 * @param {string} clientId
 * @param {string} deviceCode
 * @param {number} intervalSeconds
 */
export async function pollForToken(clientId, deviceCode, intervalSeconds) {
  const pollMs = (intervalSeconds || 5) * 1000;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await sleep(pollMs);

    const res = await fetch("https://github.com/login/oauth/access_token", {
      method:  "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body:    JSON.stringify({
        client_id:   clientId,
        device_code: deviceCode,
        grant_type:  "urn:ietf:params:oauth:grant-type:device_code",
      }),
    });

    const data = await res.json();

    if (data.access_token) return data.access_token;

    const err = data.error;
    if (err === "authorization_pending") continue;
    if (err === "slow_down") {
      await sleep(5000); // additional back-off
      continue;
    }
    if (err === "expired_token") throw new Error("Device code expired. Please run `crawsecure login` again.");
    if (err === "access_denied")  throw new Error("Login cancelled.");
    throw new Error(`GitHub OAuth error: ${data.error_description ?? err}`);
  }
}

/**
 * Exchange the GitHub access token for a CrawSecure API key.
 * @param {string} githubToken
 * @returns {{ token: string, name: string, plan: string }}
 */
export async function exchangeWithCrawSecure(githubToken) {
  const res = await fetch(`${BASE_URL}/api/auth/cli/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ githubToken }),
  });
  if (!res.ok) {
    let msg = `Server error (${res.status})`;
    try { msg = (await res.json()).error ?? msg; } catch { /* noop */ }
    throw new Error(msg);
  }
  return res.json(); // { token, name, plan }
}

/** Full login flow. Writes auth to disk on success. */
export async function runLogin() {
  console.log("Fetching config...");
  const { githubClientId } = await fetchCliConfig();

  console.log("Requesting device code...");
  const { device_code, user_code, verification_uri, interval } =
    await requestDeviceCode(githubClientId);

  console.log("");
  console.log(`  Open  →  ${verification_uri}`);
  console.log(`  Code  →  ${user_code}`);
  console.log("");
  console.log("Waiting for GitHub authorization...");

  const githubToken = await pollForToken(githubClientId, device_code, interval);
  const auth        = await exchangeWithCrawSecure(githubToken);

  saveAuth(auth);

  const planLabel = auth.plan === "pro" ? "PRO" : "FREE";
  console.log(`\n  Logged in as @${auth.name}  [${planLabel}]\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
