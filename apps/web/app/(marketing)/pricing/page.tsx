import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free to start. Upgrade to PRO for unlimited scans and advanced features.",
};

const plans = [
  {
    name: "Anonymous",
    price: "Free",
    description: "Try before you sign in",
    badge: null,
    features: [
      "Load crawsecure.json",
      "Browser-side analysis",
      "Score summary (no details)",
      "No account required",
    ],
    locked: ["Rule names", "File paths", "Recommendations", "Scan history"],
    cta: "Start scanning",
    href: "/analyze",
    variant: "outline" as const,
  },
  {
    name: "Free",
    price: "Free",
    description: "For individuals and small projects",
    badge: null,
    features: [
      "GitHub sign-in",
      "10 scans / month",
      "Full rule details",
      "File paths & explanations",
      "Last 5 scans in history",
    ],
    locked: ["Advanced rules", "Unlimited scans", "Export", "Score timeline"],
    cta: "Sign in with GitHub",
    href: "/analyze",
    variant: "outline" as const,
  },
  {
    name: "PRO",
    price: "$9",
    period: "/month",
    description: "For teams and power users",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "Unlimited scans",
      "Advanced & heuristic rules",
      "Full scan history",
      "Export JSON & PDF",
      "Score evolution chart",
      "API key for CI/CD",
      "\"Verified Scan\" badge",
    ],
    locked: [],
    cta: "Upgrade to PRO",
    href: "/upgrade",
    variant: "default" as const,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Simple, honest pricing</h1>
        <p className="text-muted-foreground">
          Start for free. Upgrade when you need more.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.badge ? "border-violet-400 dark:border-violet-600 shadow-md" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                {plan.badge && (
                  <Badge className="bg-violet-600 text-white text-xs">{plan.badge}</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500 shrink-0">✓</span>
                  <span>{f}</span>
                </div>
              ))}
              {plan.locked.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="shrink-0">—</span>
                  <span>{f}</span>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button asChild variant={plan.variant} className="w-full">
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        All plans — your code never leaves your machine.{" "}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">
          Learn how we protect your privacy →
        </Link>
      </p>
    </div>
  );
}
