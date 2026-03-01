import Link from "next/link";
import type { UsageRecord } from "@/lib/scans";

interface Props {
  usage: UsageRecord;
  plan:  "free" | "pro";
}

export function UsageMeter({ usage, plan }: Props) {
  if (plan === "pro") {
    return (
      <div className="flex items-center gap-2.5 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          PRO
        </span>
        <span className="text-muted-foreground">
          {usage.scansThisMonth} scans this month · unlimited
        </span>
      </div>
    );
  }

  const pct  = Math.min(100, Math.round((usage.scansThisMonth / (usage.limit ?? 10)) * 100));
  const near = pct >= 80;

  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {usage.scansThisMonth} / {usage.limit} scans this month
        </span>
        {near && (
          <Link href="/upgrade" className="font-medium text-primary hover:underline underline-offset-4">
            Upgrade →
          </Link>
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${near ? "bg-amber-500" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
