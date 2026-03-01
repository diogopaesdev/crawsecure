import type { Metadata }    from "next";
import { getServerSession } from "next-auth";
import { redirect }         from "next/navigation";
import Link                 from "next/link";
import { getTranslations }  from "next-intl/server";
import { authOptions }      from "@/lib/auth";
import { getUserScans, getUsage } from "@/lib/scans";
import { ScanCard }         from "@/components/dashboard/ScanCard";
import { UsageMeter }       from "@/components/dashboard/UsageMeter";
import { StatsBar }         from "@/components/dashboard/StatsBar";
import { ScoreTrendChart }  from "@/components/dashboard/ScoreTrendChart";
import { Button }           from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard");
  return { title: t("title") };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const t = await getTranslations("dashboard");
  const { id: userId, plan } = session.user;

  const [scans, usage] = await Promise.all([
    getUserScans(userId, plan),
    getUsage(userId, plan),
  ]);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <Button asChild size="sm">
          <Link href="/analyze">{t("newScan")}</Link>
        </Button>
      </div>

      {/* Usage */}
      <UsageMeter usage={usage} plan={plan} />

      {/* Aggregate stats */}
      {scans.length >= 2 && (
        <div className="flex flex-col gap-3">
          <StatsBar scans={scans} />
          <ScoreTrendChart scans={scans} />
        </div>
      )}

      {/* History limit notice */}
      {plan === "free" && scans.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {t("historyNotice", { limit: 5 })}{" "}
          <Link href="/upgrade" className="text-violet-600 hover:underline">
            {t("upgradeLink")}
          </Link>
        </p>
      )}

      {/* Scan list */}
      {scans.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
          <Button asChild variant="outline">
            <Link href="/analyze">{t("emptyLink")}</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {scans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      )}

      {/* PRO upsell if near limit */}
      {plan === "free" && usage.remaining !== null && usage.remaining <= 2 && (
        <div className="rounded-lg border border-violet-200 bg-violet-50 dark:bg-violet-950/20 dark:border-violet-900 p-4 text-sm flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">{t("runningLow")}</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {t("runningLowDesc", { remaining: usage.remaining, limit: usage.limit ?? 10 })}
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 bg-violet-600 hover:bg-violet-700">
            <Link href="/upgrade">{t("upgradePrompt")}</Link>
          </Button>
        </div>
      )}

    </div>
  );
}
