import { NextResponse }     from "next/server";
import { getServerSession } from "next-auth";
import { authOptions }      from "@/lib/auth";
import { getStripe }        from "@/lib/stripe";
import { db, FIREBASE_READY } from "@/lib/firebase-admin";

// POST /api/portal — creates a Stripe Customer Portal session for billing management.
// Allows PRO users to cancel, update payment method, view invoices.

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch stripeCustomerId from Firestore
  if (!FIREBASE_READY || !db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const subDoc = await db.collection("subscriptions").doc(session.user.id).get();
  if (!subDoc.exists) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
  }

  const { stripeCustomerId } = subDoc.data() as { stripeCustomerId: string };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer:   stripeCustomerId,
    return_url: `${appUrl}/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}
