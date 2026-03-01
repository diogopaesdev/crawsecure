import type { Metadata }    from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Link                 from "next/link";
import { authOptions }      from "@/lib/auth";
import { getScanById }      from "@/lib/scans";
import { getRuleMeta }      from "@/lib/rules-meta";
import { ScoreGauge }       from "@/components/scanner/ScoreGauge";
import { Badge }            from "@/components/ui/badge";
import { Button }           from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator }        from "@/components/ui/separator";
import type { RiskLevel }   from "@/types/scanner";

export const metadata: Metadata = { title: "Scan Detail" };

const LEVEL_ICON: Record<string, string> = { high: "🔴", medium: "🟡", low: "🔵" };
const LEVEL_BADGE: Record<string, "destructive" | "secondary" | "outline"> = {
  high:   "destructive",
  medium: "secondary",
  low:    "outline",
};

export default async function ScanDetailPage({
  params,
}: {
  params: { scanId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const scan = await getScanById(params.scanId, session.user.id);
  if (!scan) notFound();

  const { score, risk, summary, rulesTriggered, filesScanned, createdAt } = scan;

  // Enrich rule IDs with descriptions from rules-meta
  const enrichedRules = rulesTriggered.map((id) => ({ id, ...getRuleMeta(id) }));
  const byLevel = {
    high:   enrichedRules.filter(r => r.level === "high"),
    medium: enrichedRules.filter(r => r.level === "medium"),
    low:    enrichedRules.filter(r => r.level === "low"),
  };

  return (
    <div className="max-w-xl flex flex-col gap-4">

      {/* Back */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 self-start text-muted-foreground">
        <Link href="/dashboard">← Back to dashboard</Link>
      </Button>

      {/* Score */}
      <Card>
        <CardHeader className="pb-2">
          <ScoreGauge score={score} risk={risk as RiskLevel} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-6 text-sm">
            <span className="flex items-center gap-1.5">🔴 <strong>{summary.critical}</strong> Critical</span>
            <span className="flex items-center gap-1.5">🟡 <strong>{summary.warning}</strong> Warnings</span>
            <span className="flex items-center gap-1.5">🔵 <strong>{summary.info}</strong> Info</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {filesScanned} file{filesScanned !== 1 ? "s" : ""} scanned ·{" "}
            {new Date(createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Rules triggered */}
      {rulesTriggered.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Rules triggered</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {(["high", "medium", "low"] as const).map((level, li) => (
              byLevel[level].length > 0 && (
                <div key={level} className="flex flex-col gap-2">
                  {li > 0 && <Separator />}
                  {byLevel[level].map((rule) => (
                    <div key={rule.id} className="flex items-start gap-2 text-sm">
                      <span className="shrink-0">{LEVEL_ICON[rule.level]}</span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            variant={LEVEL_BADGE[rule.level]}
                            className="font-mono text-[10px]"
                          >
                            {rule.id}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground">{rule.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ))}
          </CardContent>
        </Card>
      )}

      {rulesTriggered.length === 0 && (
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            ✅ No security signals were triggered in this scan.
          </CardContent>
        </Card>
      )}

      {/* Privacy note */}
      <p className="text-xs text-muted-foreground text-center">
        Only rule IDs and aggregate counts are stored — no file paths or code.{" "}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">
          Privacy policy →
        </Link>
      </p>
    </div>
  );
}
