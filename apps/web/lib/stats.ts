// Global scan counter — server-side only.
// Tracks total scans performed (guest + logged-in), no PII.

import { db, FIREBASE_READY } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const STATS_DOC = "stats/global";

export async function incrementScanCount(): Promise<void> {
  if (!FIREBASE_READY || !db) return;
  await db.doc(STATS_DOC).set(
    { totalScans: FieldValue.increment(1) },
    { merge: true }
  );
}

export async function getTotalScans(): Promise<number> {
  if (!FIREBASE_READY || !db) return 0;
  const doc = await db.doc(STATS_DOC).get();
  return (doc.data()?.totalScans as number) ?? 0;
}
