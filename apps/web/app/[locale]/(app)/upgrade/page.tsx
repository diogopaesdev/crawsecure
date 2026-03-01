import type { Metadata }    from "next";
import { getServerSession } from "next-auth";
import { redirect }         from "next/navigation";
import { getTranslations }  from "next-intl/server";
import { authOptions }      from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator }        from "@/components/ui/separator";
import { CheckoutButton }   from "@/components/upgrade/CheckoutButton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("upgrade");
  return { title: t("title") };
}

const proFeatures = [
  { icon: "♾️",  key: "unlimitedScans"   },
  { icon: "🔬",  key: "advancedRules"    },
  { icon: "📜",  key: "fullHistory"      },
  { icon: "📥",  key: "exportJson"       },
  { icon: "📈",  key: "trendChart"       },
  { icon: "🔑",  key: "apiKey"           },
  { icon: "✅",  key: "verifiedBadge"    },
] as const;

const freeFeatures = [
  { icon: "✓", key: "tenScans"     },
  { icon: "✓", key: "ruleDetails"  },
  { icon: "✓", key: "filePaths"    },
  { icon: "✓", key: "last5Scans"   },
] as const;

// Feature labels are hardcoded here since they're product-specific
const PRO_LABELS: Record<string, string> = {
  unlimitedScans: "Unlimited scans per month",
  advancedRules:  "Advanced & heuristic rules",
  fullHistory:    "Full scan history",
  exportJson:     "Export JSON & PDF (client-side)",
  trendChart:     "Score evolution chart",
  apiKey:         "API key for CI/CD pipelines",
  verifiedBadge:  '"Verified Scan" badge',
};

const FREE_LABELS: Record<string, string> = {
  tenScans:    "10 scans / month",
  ruleDetails: "Full rule details",
  filePaths:   "File paths & explanations",
  last5Scans:  "Last 5 scans in history",
};

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.plan === "pro") redirect("/dashboard");

  const t = await getTranslations("upgrade");

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6 py-8">

      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-1">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="opacity-70">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t("freePlan")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {freeFeatures.map(f => (
              <div key={f.key} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-green-500">{f.icon}</span>
                <span>{FREE_LABELS[f.key]}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-violet-400 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-violet-600">{t("proPlan")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {proFeatures.map(f => (
              <div key={f.key} className="flex items-center gap-2 text-xs">
                <span>{f.icon}</span>
                <span>{PRO_LABELS[f.key]}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />
      <CheckoutButton />

      <p className="text-center text-xs text-muted-foreground">{t("trust")}</p>
    </div>
  );
}
