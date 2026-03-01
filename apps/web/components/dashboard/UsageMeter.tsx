import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { UsageRecord } from "@/lib/scans";

interface Props {
  usage: UsageRecord;
  plan:  "free" | "pro";
}

export function UsageMeter({ usage, plan }: Props) {
  if (plan === "pro") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge>PRO</Badge>
        <span>{usage.scansThisMonth} scans this month · unlimited</span>
      </div>
    );
  }

  const pct  = Math.min(100, Math.round((usage.scansThisMonth / (usage.limit ?? 10)) * 100));
  const near = pct >= 80;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {usage.scansThisMonth} / {usage.limit} scans this month
        </span>
        {near && (
          <Link href="/upgrade" className="text-xs text-violet-600 hover:underline">
            Upgrade to PRO →
          </Link>
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${near ? "bg-yellow-500" : "bg-violet-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
