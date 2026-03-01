import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/usage — returns current month scan count and limit for the user.
// Implemented in Step 4 (Firebase integration).

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO (Step 4): query Firestore usage/{userId}_{period}
  const plan = session.user.plan;
  return NextResponse.json({
    plan,
    scansThisMonth: 0,
    limit: plan === "pro" ? null : 10, // null = unlimited
    message: "Step 4 will implement real usage tracking",
  });
}
