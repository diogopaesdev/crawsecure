import type { Metadata }    from "next";
import { getServerSession } from "next-auth";
import { redirect }         from "next/navigation";
import { authOptions }      from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator }        from "@/components/ui/separator";
import { CheckoutButton }   from "@/components/upgrade/CheckoutButton";

export const metadata: Metadata = { title: "Upgrade to PRO" };

const proFeatures = [
  { icon: "♾️",  text: "Unlimited scans per month"         },
  { icon: "🔬",  text: "Advanced & heuristic rules"         },
  { icon: "📜",  text: "Full scan history"                  },
  { icon: "📥",  text: "Export JSON & PDF (client-side)"    },
  { icon: "📈",  text: "Score evolution chart"              },
  { icon: "🔑",  text: "API key for CI/CD pipelines"        },
  { icon: "✅",  text: '"Verified Scan" badge'              },
];

const freeFeatures = [
  { icon: "✓", text: "10 scans / month"            },
  { icon: "✓", text: "Full rule details"            },
  { icon: "✓", text: "File paths & explanations"   },
  { icon: "✓", text: "Last 5 scans in history"     },
];

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.plan === "pro") redirect("/dashboard");

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 py-8">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-1">Upgrade to PRO</h1>
        <p className="text-muted-foreground text-sm">$9 / month · Cancel anytime</p>
      </div>

      {/* Plan comparison */}
      <div className="grid grid-cols-2 gap-4">

        {/* Current: Free */}
        <Card className="opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Free (current)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {freeFeatures.map(f => (
              <div key={f.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-green-500">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* PRO */}
        <Card className="border-violet-400 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-violet-600">
              PRO
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {proFeatures.map(f => (
              <div key={f.text} className="flex items-center gap-2 text-xs">
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Checkout */}
      <CheckoutButton />

      {/* Trust */}
      <p className="text-center text-xs text-muted-foreground">
        Your code is never involved in billing. Payment is handled by Stripe.
      </p>
    </div>
  );
}
