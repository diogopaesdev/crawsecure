import { NextResponse }  from "next/server";
import { resolveAuth }  from "@/lib/api-auth";
import { getUsage }     from "@/lib/scans";
import { db, FIREBASE_READY } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  const auth = await resolveAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, plan } = auth;

  // Fetch display name
  let name: string | null = null;
  if (FIREBASE_READY && db) {
    try {
      const doc = await db.collection("users").doc(userId).get();
      name = doc.data()?.displayName ?? null;
    } catch {
      // non-fatal
    }
  }

  const usage = await getUsage(userId, plan);

  return NextResponse.json({
    name,
    plan,
    scansThisMonth: usage.scansThisMonth,
    remaining:      usage.remaining,
    limit:          usage.limit,
    period:         usage.period,
  });
}
