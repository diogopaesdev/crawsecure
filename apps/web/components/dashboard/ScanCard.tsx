import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { StoredScan } from "@/lib/scans";

const RISK_BADGE: Record<string, "destructive" | "secondary" | "outline"> = {
  HIGH:   "destructive",
  MEDIUM: "secondary",
  SAFE:   "outline",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  return `${days}d ago`;
}

export function ScanCard({ scan }: { scan: StoredScan }) {
  const { id, score, risk, summary, rulesTriggered, filesScanned, createdAt } = scan;
  const preview = rulesTriggered.slice(0, 3);
  const extra   = rulesTriggered.length - preview.length;

  return (
    <Link href={`/dashboard/${id}`}>
      <Card className="hover:border-violet-300 hover:shadow-sm transition-all cursor-pointer">
        <CardContent className="py-3 flex items-center gap-4">

          {/* Score */}
          <div className="shrink-0 text-center w-12">
            <p className="text-xl font-bold tabular-nums">{score}</p>
            <Badge variant={RISK_BADGE[risk] ?? "outline"} className="text-[10px] px-1">
              {risk}
            </Badge>
          </div>

          {/* Counts */}
          <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
            <span>🔴 {summary.critical}</span>
            <span>🟡 {summary.warning}</span>
            <span>🔵 {summary.info}</span>
          </div>

          {/* Rules */}
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {preview.map(r => (
              <Badge key={r} variant="outline" className="font-mono text-[10px]">{r}</Badge>
            ))}
            {extra > 0 && (
              <Badge variant="outline" className="text-[10px]">+{extra}</Badge>
            )}
          </div>

          {/* Meta */}
          <div className="shrink-0 text-right text-xs text-muted-foreground">
            <p>{filesScanned} files</p>
            <p>{relativeTime(createdAt)}</p>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}
