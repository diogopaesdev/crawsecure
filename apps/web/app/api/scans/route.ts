import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/scans — saves aggregated scan summary to Firestore.
// Implemented in Step 4 (Firebase integration).
// Code never reaches this endpoint — only summary signals.

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO (Step 4): validate body, check usage limits, write to Firestore
  const body = await request.json();
  console.log("[scans] received summary:", body);

  return NextResponse.json({ ok: true, message: "Step 4 will implement persistence" });
}
