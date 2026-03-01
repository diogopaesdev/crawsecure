// Firestore service layer — server-side only.
// All writes contain only aggregated signals. No code, no file contents.

import { db, FIREBASE_READY } from "./firebase-admin";
import type { RiskLevel, ScanSummary } from "@/types/scanner";

export const FREE_SCAN_LIMIT = 10;
export const FREE_HISTORY_LIMIT = 5;

// ── Types ──────────────────────────────────────────────────────────────────

export interface StoredScan {
  id:             string;
  userId:         string;
  summary:        ScanSummary;
  score:          number;
  risk:           RiskLevel;
  rulesTriggered: string[];
  filesScanned:   number;
  createdAt:      string; // ISO string (serialized from Timestamp)
}

export interface UsageRecord {
  scansThisMonth: number;
  limit:          number | null; // null = unlimited (PRO)
  remaining:      number | null;
  period:         string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function usageDocId(userId: string, period: string) {
  return `${userId}_${period}`;
}

// ── Reads ──────────────────────────────────────────────────────────────────

export async function getUserScans(
  userId: string,
  plan: "free" | "pro",
): Promise<StoredScan[]> {
  if (!FIREBASE_READY || !db) return [];

  const limit = plan === "pro" ? 50 : FREE_HISTORY_LIMIT;

  const snap = await db
    .collection("scans")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id:             doc.id,
      userId:         d.userId,
      summary:        d.summary,
      score:          d.score,
      risk:           d.risk,
      rulesTriggered: d.rulesTriggered ?? [],
      filesScanned:   d.filesScanned ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createdAt:      (d.createdAt as any)?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    };
  });
}

export async function getScanById(
  scanId: string,
  userId: string,
): Promise<StoredScan | null> {
  if (!FIREBASE_READY || !db) return null;

  const doc = await db.collection("scans").doc(scanId).get();
  if (!doc.exists) return null;

  const d = doc.data()!;
  // Ensure the scan belongs to the requesting user
  if (d.userId !== userId) return null;

  return {
    id:             doc.id,
    userId:         d.userId,
    summary:        d.summary,
    score:          d.score,
    risk:           d.risk,
    rulesTriggered: d.rulesTriggered ?? [],
    filesScanned:   d.filesScanned ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createdAt:      (d.createdAt as any)?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getUsage(
  userId: string,
  plan: "free" | "pro",
): Promise<UsageRecord> {
  const period = getCurrentPeriod();
  const limit  = plan === "pro" ? null : FREE_SCAN_LIMIT;

  if (!FIREBASE_READY || !db) {
    return { scansThisMonth: 0, limit, remaining: limit, period };
  }

  const doc = await db.collection("usage").doc(usageDocId(userId, period)).get();
  const count = doc.exists ? (doc.data()!.scansCount as number) : 0;

  return {
    scansThisMonth: count,
    limit,
    remaining:      limit === null ? null : Math.max(0, limit - count),
    period,
  };
}

// ── Writes ─────────────────────────────────────────────────────────────────

export interface SaveScanInput {
  scanId:         string;
  userId:         string;
  summary:        ScanSummary;
  score:          number;
  risk:           RiskLevel;
  rulesTriggered: string[];
  filesScanned:   number;
}

export async function saveScan(input: SaveScanInput): Promise<void> {
  if (!FIREBASE_READY || !db) {
    throw new Error("Firebase is not configured. Set env vars to enable persistence.");
  }

  const period    = getCurrentPeriod();
  const usageId   = usageDocId(input.userId, period);
  const usageRef  = db.collection("usage").doc(usageId);
  const scansRef  = db.collection("scans").doc(input.scanId);

  await db.runTransaction(async (tx) => {
    const usageDoc = await tx.get(usageRef);
    const count    = usageDoc.exists ? (usageDoc.data()!.scansCount as number) : 0;

    tx.set(scansRef, {
      id:             input.scanId,
      userId:         input.userId,
      summary:        input.summary,
      score:          input.score,
      risk:           input.risk,
      rulesTriggered: input.rulesTriggered,
      filesScanned:   input.filesScanned,
      createdAt:      new Date(),
    });

    tx.set(
      usageRef,
      { userId: input.userId, period, scansCount: count + 1, lastScanAt: new Date() },
      { merge: true },
    );
  });
}

export async function updateUserPlan(
  userId: string,
  plan: "free" | "pro",
): Promise<void> {
  if (!FIREBASE_READY || !db) return;
  await db.collection("users").doc(userId).update({ plan });
}

export interface SubscriptionInput {
  userId:               string;
  stripeCustomerId:     string;
  stripeSubscriptionId: string;
  stripePriceId:        string;
  status:               "active" | "canceled" | "past_due";
  currentPeriodEnd:     Date;
  cancelAtPeriodEnd:    boolean;
}

export async function saveSubscription(input: SubscriptionInput): Promise<void> {
  if (!FIREBASE_READY || !db) return;
  await db.collection("subscriptions").doc(input.userId).set(input, { merge: true });
}

export async function deleteScan(scanId: string, userId: string): Promise<void> {
  if (!FIREBASE_READY || !db) return;

  const ref = db.collection("scans").doc(scanId);
  const doc = await ref.get();
  if (!doc.exists) return;
  if (doc.data()?.userId !== userId) throw new Error("Forbidden");

  await ref.delete();
}

export async function ensureUserDoc(
  userId: string,
  profile: { email?: string | null; name?: string | null; image?: string | null; githubId: string },
): Promise<"free" | "pro"> {
  if (!FIREBASE_READY || !db) return "free";

  const ref = db.collection("users").doc(userId);
  const doc = await ref.get();

  if (!doc.exists) {
    await ref.set({
      id:          userId,
      githubId:    profile.githubId,
      email:       profile.email ?? null,
      displayName: profile.name  ?? null,
      avatarUrl:   profile.image ?? null,
      plan:        "free",
      createdAt:   new Date(),
      lastSeenAt:  new Date(),
    });
    return "free";
  }

  await ref.update({ lastSeenAt: new Date() });
  return (doc.data()!.plan as "free" | "pro") ?? "free";
}
