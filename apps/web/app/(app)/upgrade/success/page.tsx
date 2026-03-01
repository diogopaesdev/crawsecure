import type { Metadata }    from "next";
import { getServerSession } from "next-auth";
import { redirect }         from "next/navigation";
import { authOptions }      from "@/lib/auth";
import { getStripe }        from "@/lib/stripe";
import { updateUserPlan }   from "@/lib/scans";
import { SuccessView }      from "@/components/upgrade/SuccessView";

export const metadata: Metadata = { title: "Welcome to PRO" };

export default async function UpgradeSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { session_id } = searchParams;
  if (!session_id) redirect("/upgrade");

  // Verify payment directly with Stripe — do not rely solely on the webhook
  // (webhook may fire slightly after the redirect)
  try {
    const checkoutSession = await getStripe().checkout.sessions.retrieve(session_id);

    if (
      checkoutSession.payment_status === "paid" &&
      checkoutSession.metadata?.userId === session.user.id
    ) {
      // Idempotent: also handled by checkout.session.completed webhook
      await updateUserPlan(session.user.id, "pro");
    }
  } catch {
    // If Stripe verification fails, proceed — webhook will still fire
  }

  // SuccessView (client component) calls session.update() to refresh JWT
  return <SuccessView />;
}
