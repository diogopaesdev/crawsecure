import type { Metadata }    from "next";
import { getServerSession } from "next-auth";
import { redirect }         from "next/navigation";
import Link                 from "next/link";
import { authOptions }      from "@/lib/auth";
import { getUserScans, getUsage } from "@/lib/scans";
import { ScanCard }         from "@/components/dashboard/ScanCard";
import { UsageMeter }       from "@/components/dashboard/UsageMeter";
import { Button }           from "@/components/ui/button";
import { Badge }            from "@/components/ui/badge";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { id: userId, plan } = session.user;

  const [scans, usage] = await Promise.all([
    getUserScans(userId, plan),
    getUsage(userId, plan),
  ]);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold">Your Scans</h1>
        <Button asChild size="sm">
          <Link href="/analyze">New scan</Link>
        </Button>
      </div>

      {/* Usage */}
      <UsageMeter usage={usage} plan={plan} />

      {/* History limit notice for free users */}
      {plan === "free" && scans.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing your last 5 scans.{" "}
          <Link href="/upgrade" className="text-violet-600 hover:underline">
            Upgrade to PRO
          </Link>{" "}
          for full history.
        </p>
      )}

      {/* Scan list */}
      {scans.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-muted-foreground text-sm">No scans saved yet.</p>
          <Button asChild variant="outline">
            <Link href="/analyze">Run your first scan</Link>
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
            <p className="font-medium">Running low on scans</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {usage.remaining} scan{usage.remaining !== 1 ? "s" : ""} left this month.
              PRO gives you unlimited scans.
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 bg-violet-600 hover:bg-violet-700">
            <Link href="/upgrade">Upgrade</Link>
          </Button>
        </div>
      )}

    </div>
  );
}
