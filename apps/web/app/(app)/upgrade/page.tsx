import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Upgrade to PRO" };

const proFeatures = [
  "Unlimited scans",
  "Advanced & heuristic rules",
  "Full scan history",
  "Export JSON & PDF",
  "Score evolution chart",
  "API key for CI/CD",
  "\"Verified Scan\" badge",
];

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.plan === "pro") redirect("/dashboard");

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Upgrade to PRO</h1>
        <p className="text-muted-foreground text-sm">
          $9 / month. Cancel anytime.
        </p>
      </div>

      <Card className="border-violet-400 shadow-md">
        <CardHeader>
          <CardTitle className="text-base">What you get</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {proFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span> {f}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stripe Checkout integration in Step 5 */}
      <Button size="lg" className="w-full bg-violet-600 hover:bg-violet-700" disabled>
        Continue to payment — coming in Step 5
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secure payment via Stripe. Your code is never involved.
      </p>
    </div>
  );
}
