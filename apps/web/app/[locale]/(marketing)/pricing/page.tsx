import type { Metadata } from "next";
import Link from "next/link";
import { Button }   from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    note: null,
    features: [
      "Load crawsecure.json",
      "Browser-side analysis",
      "Score summary (blurred details)",
      "No account required",
    ],
    locked: ["Full rule details", "Scan history", "Export", "Score trend"],
    cta: "Start scanning",
    href: "/analyze",
    variant: "outline" as const,
  },
  {
    name: "Free",
    price: "Free",
    description: "For individuals and small projects",
    badge: null,
    note: null,
    features: [
      "GitHub sign-in",
      "10 scans / month",
      "Full rule details",
      "Last 5 scans in history",
      "JSON export from dashboard",
    ],
    locked: ["Unlimited scans", "Full history (50 scans)", "Score trend chart"],
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
    note: "Cancel anytime · No questions asked",
    features: [
      "Everything in Free",
      "Unlimited scans",
      "Full history (up to 50 scans)",
      "Score evolution trend chart",
      "Aggregate stats (avg, best, top rule)",
      "JSON export from dashboard",
      "Stripe billing portal",
    ],
    locked: [],
    cta: "Upgrade to PRO",
    href: "/upgrade",
    variant: "default" as const,
  },
];

const pricingFaqs = [
  {
    q: "Can I cancel my PRO subscription at any time?",
    a: "Yes — cancel from the billing portal in your settings page. You keep PRO access until the end of the current billing period, with no additional charges.",
  },
  {
    q: "Is there a free trial for PRO?",
    a: "The Free plan gives you 10 scans per month at no cost, so you can evaluate CrawSecure before upgrading. There is no time-limited trial for PRO.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards (Visa, Mastercard, Amex) via Stripe. Stripe also supports Apple Pay and Google Pay in supported browsers.",
  },
  {
    q: "Does PRO cover a team or just one account?",
    a: "Currently PRO is per GitHub account. Team plans (shared limits, shared history) are on the roadmap.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you are unsatisfied within the first 7 days of a new subscription, contact us and we will issue a full refund — no questions asked.",
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col gap-16">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">Simple, honest pricing</h1>
        <p className="text-muted-foreground">
          Start for free. Upgrade when you need more.
        </p>
      </div>

      {/* Plans grid */}
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

            <CardFooter className="flex flex-col gap-2">
              <Button asChild variant={plan.variant} className="w-full">
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
              {plan.note && (
                <p className="text-[11px] text-center text-muted-foreground">{plan.note}</p>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Privacy guarantee */}
      <p className="text-center text-xs text-muted-foreground -mt-8">
        All plans — your code never leaves your machine.{" "}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">
          Learn how we protect your privacy →
        </Link>
      </p>

      <Separator />

      {/* FAQ */}
      <section className="max-w-2xl mx-auto w-full flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-center">Pricing FAQ</h2>
        <Accordion type="single" collapsible className="flex flex-col gap-0">
          {pricingFaqs.map(({ q, a }, i) => (
            <AccordionItem key={i} value={`pfaq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </div>
  );
}
