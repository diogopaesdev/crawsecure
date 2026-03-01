import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { StoredScan } from "@/lib/scans";

const RISK_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  HIGH:   { dot: "bg-red-500",    text: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-950/40" },
  MEDIUM: { dot: "bg-amber-500",  text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
  SAFE:   { dot: "bg-emerald-500",text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
};

function relativeTime(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
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
  const style   = RISK_STYLES[risk] ?? RISK_STYLES.SAFE;
  const preview = rulesTriggered.slice(0, 3);
  const extra   = rulesTriggered.length - preview.length;

  return (
    <Link href={`/dashboard/${id}`}>
      <div className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5 hover:border-primary/30 hover:shadow-sm transition-all">

        {/* Score badge */}
        <div className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl ${style.bg}`}>
          <span className={`text-base font-bold tabular-nums leading-none ${style.text}`}>{score}</span>
          <span className={`text-[9px] font-medium mt-0.5 ${style.text} opacity-70`}>{risk}</span>
        </div>

        {/* Counts */}
        <div className="flex gap-3 text-xs text-muted-foreground shrink-0">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {summary.critical}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {summary.warning}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {summary.info}
          </span>
        </div>

        {/* Rule tags */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {preview.map(r => (
            <span
              key={r}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded-md border border-border/60 bg-muted text-muted-foreground"
            >
              {r}
            </span>
          ))}
          {extra > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-border/60 bg-muted text-muted-foreground">
              +{extra}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="shrink-0 text-right text-xs text-muted-foreground hidden sm:block">
          <p>{filesScanned} files</p>
          <p>{relativeTime(createdAt)}</p>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
      </div>
    </Link>
  );
}
