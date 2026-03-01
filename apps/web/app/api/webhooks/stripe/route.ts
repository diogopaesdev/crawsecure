import { NextResponse } from "next/server";

// POST /api/webhooks/stripe — handles Stripe subscription events.
// Implemented in Step 5 (Stripe integration).
// This route must NOT use getServerSession — it's called by Stripe, not the browser.

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // TODO (Step 5):
  // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  // handle: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed
  console.log("[stripe-webhook] received event, signature:", signature.slice(0, 20));

  return NextResponse.json({ received: true });
}
