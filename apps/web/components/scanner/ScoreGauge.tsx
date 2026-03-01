import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/scanner";

const RISK_CONFIG: Record<RiskLevel, { label: string; bar: string; text: string; pct: number }> = {
  SAFE:   { label: "SAFE",   bar: "bg-green-500",  text: "text-green-600 dark:text-green-400",  pct: 22  },
  MEDIUM: { label: "MEDIUM", bar: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", pct: 55 },
  HIGH:   { label: "HIGH",   bar: "bg-red-500",    text: "text-red-600 dark:text-red-400",       pct: 88  },
};

interface Props {
  score: number;
  risk:  RiskLevel;
}

export function ScoreGauge({ score, risk }: Props) {
  const { label, bar, text, pct } = RISK_CONFIG[risk];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums">{score}</span>
          <span className="text-sm text-muted-foreground">risk score</span>
        </div>
        <span className={cn("text-sm font-semibold tracking-wide", text)}>{label}</span>
      </div>

      {/* Bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bar)}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Zone labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>SAFE</span>
        <span>MEDIUM</span>
        <span>HIGH</span>
      </div>
    </div>
  );
}
