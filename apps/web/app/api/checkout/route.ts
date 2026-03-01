import { NextResponse }     from "next/server";
import { getServerSession } from "next-auth";
import { authOptions }      from "@/lib/auth";
import { getStripe, PRO_PRICE_ID } from "@/lib/stripe";

// POST /api/checkout — creates a Stripe Checkout Session and returns the URL.
// The client redirects to Stripe's hosted checkout page.

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.plan === "pro") {
    return NextResponse.json({ error: "Already on PRO" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer_email:         session.user.email ?? undefined,
    metadata:               { userId: session.user.id },
    line_items:             [{ price: PRO_PRICE_ID, quantity: 1 }],
    mode:                   "subscription",
    allow_promotion_codes:  true,
    success_url: `${appUrl}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${appUrl}/upgrade`,
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
