import { Badge } from "@/components/ui/badge";
import type { StoredScan } from "@/lib/scans";

interface Props {
  scans: StoredScan[];
}

export function StatsBar({ scans }: Props) {
  if (scans.length === 0) return null;

  const scores  = scans.map((s) => s.score);
  const avg     = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best    = Math.min(...scores);

  // Most frequently triggered rule across all scans
  const freq: Record<string, number> = {};
  for (const scan of scans) {
    for (const rule of scan.rulesTriggered) {
      freq[rule] = (freq[rule] ?? 0) + 1;
    }
  }
  const topRule = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const highCount   = scans.filter((s) => s.risk === "HIGH").length;
  const mediumCount = scans.filter((s) => s.risk === "MEDIUM").length;
  const safeCount   = scans.filter((s) => s.risk === "SAFE").length;

  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Avg score</span>
        <span className="font-semibold tabular-nums">{avg}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Best score</span>
        <span className="font-semibold tabular-nums text-green-600 dark:text-green-400">{best}</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Risk breakdown</span>
        <div className="flex gap-1 flex-wrap">
          {highCount   > 0 && <Badge variant="destructive" className="text-[10px] px-1">{highCount} HIGH</Badge>}
          {mediumCount > 0 && <Badge variant="secondary"   className="text-[10px] px-1">{mediumCount} MED</Badge>}
          {safeCount   > 0 && <Badge variant="outline"     className="text-[10px] px-1">{safeCount} SAFE</Badge>}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">Top rule</span>
        {topRule ? (
          <Badge variant="outline" className="font-mono text-[10px] self-start">{topRule}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </div>

    </div>
  );
}
