import crypto                 from "crypto";
import { db, FIREBASE_READY } from "./firebase-admin";

const KEY_PREFIX = "cws_";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randomKey(): string {
  return KEY_PREFIX + crypto.randomBytes(32).toString("hex");
}

/**
 * Verify a raw API key.
 * Returns { userId } if valid, null otherwise.
 * Also updates lastUsedAt on the key doc.
 */
export async function verifyApiKey(token: string): Promise<{ userId: string } | null> {
  if (!FIREBASE_READY || !db) return null;
  if (!token.startsWith(KEY_PREFIX)) return null;

  const hash   = sha256(token);
  const keyDoc = await db.collection("apiKeys").doc(hash).get();
  if (!keyDoc.exists) return null;

  const data = keyDoc.data()!;

  // Update lastUsedAt non-blocking
  keyDoc.ref.update({ lastUsedAt: new Date() }).catch(() => undefined);

  return { userId: data.userId as string };
}

/**
 * Generate a new API key for userId.
 * Revokes any existing key first.
 * Returns the plain-text key (shown once).
 */
export async function generateApiKey(userId: string): Promise<string> {
  if (!FIREBASE_READY || !db) throw new Error("Firebase not configured");

  const plainKey = randomKey();
  const hash     = sha256(plainKey);

  await revokeApiKey(userId); // revoke previous key if any

  const batch = db.batch();
  batch.set(db.collection("apiKeys").doc(hash), {
    userId,
    createdAt:  new Date(),
    lastUsedAt: null,
  });
  batch.update(db.collection("users").doc(userId), {
    cliApiKeyHash:      hash,
    cliApiKeyCreatedAt: new Date(),
  });
  await batch.commit();

  return plainKey;
}

/**
 * Revoke the current API key for userId.
 */
export async function revokeApiKey(userId: string): Promise<void> {
  if (!FIREBASE_READY || !db) return;

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return;

  const existingHash = userDoc.data()?.cliApiKeyHash as string | undefined;
  if (!existingHash) return;

  const batch = db.batch();
  batch.delete(db.collection("apiKeys").doc(existingHash));
  batch.update(db.collection("users").doc(userId), {
    cliApiKeyHash:      null,
    cliApiKeyCreatedAt: null,
  });
  await batch.commit();
}
