import { NextResponse }                    from "next/server";
import { getStripe }                       from "@/lib/stripe";
import { updateUserPlan, saveSubscription } from "@/lib/scans";
import type Stripe                         from "stripe";

// POST /api/webhooks/stripe
// Called by Stripe — never by the browser. No session auth here.
// Raw body is required for signature verification.

export async function POST(request: Request) {
  const body      = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[stripe-webhook] verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    await handleEvent(event);
  } catch (err) {
    console.error("[stripe-webhook] handler error:", err);
    // Return 200 so Stripe doesn't retry — log the error for investigation
    return NextResponse.json({ received: true, error: "Handler failed" });
  }

  return NextResponse.json({ received: true });
}

// ── Event handlers ─────────────────────────────────────────────────────────

async function handleEvent(event: Stripe.Event) {
  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;
      if (session.payment_status !== "paid") break;

      const userId = session.metadata?.userId;
      if (!userId) { console.warn("[stripe-webhook] no userId in metadata"); break; }

      const subscriptionId = session.subscription as string;
      const sub = await getStripe().subscriptions.retrieve(subscriptionId);
      // Cast through unknown — Stripe v20 / clover API restructures some subscription fields
      const subRaw = sub as unknown as {
        current_period_end:  number;
        cancel_at_period_end: boolean;
      };

      await Promise.all([
        updateUserPlan(userId, "pro"),
        saveSubscription({
          userId,
          stripeCustomerId:     session.customer as string,
          stripeSubscriptionId: subscriptionId,
          stripePriceId:        sub.items.data[0]?.price.id ?? "",
          status:               "active",
          currentPeriodEnd:     new Date((subRaw.current_period_end ?? 0) * 1000),
          cancelAtPeriodEnd:    subRaw.cancel_at_period_end ?? false,
        }),
      ]);

      console.log("[stripe-webhook] activated PRO for user:", userId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub   = event.data.object as Stripe.Subscription;
      const subId = sub.id;

      // Find user by stripeSubscriptionId in subscriptions collection
      const { db, FIREBASE_READY } = await import("@/lib/firebase-admin");
      if (!FIREBASE_READY || !db) break;

      const snap = await db
        .collection("subscriptions")
        .where("stripeSubscriptionId", "==", subId)
        .limit(1)
        .get();

      if (snap.empty) { console.warn("[stripe-webhook] subscription not found:", subId); break; }

      const { userId } = snap.docs[0].data() as { userId: string };
      await Promise.all([
        updateUserPlan(userId, "free"),
        snap.docs[0].ref.update({ status: "canceled" }),
      ]);

      console.log("[stripe-webhook] downgraded to free for user:", userId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn("[stripe-webhook] payment failed for customer:", invoice.customer);
      break;
    }

    default:
      break;
  }
}
