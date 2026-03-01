import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/scanner";

interface Config {
  label:   string;
  color:   string;   // ring / text color class
  track:   string;   // gradient for the bar
  bg:      string;   // score circle bg
  pct:     number;
}

const RISK_CONFIG: Record<RiskLevel, Config> = {
  SAFE: {
    label: "SAFE",
    color: "text-emerald-600 dark:text-emerald-400",
    track: "from-emerald-400 to-emerald-500",
    bg:    "bg-emerald-50 dark:bg-emerald-950/40",
    pct:   20,
  },
  MEDIUM: {
    label: "MEDIUM",
    color: "text-amber-600 dark:text-amber-400",
    track: "from-amber-400 to-amber-500",
    bg:    "bg-amber-50 dark:bg-amber-950/40",
    pct:   55,
  },
  HIGH: {
    label: "HIGH",
    color: "text-red-600 dark:text-red-400",
    track: "from-red-400 to-red-600",
    bg:    "bg-red-50 dark:bg-red-950/40",
    pct:   90,
  },
};

interface Props {
  score: number;
  risk:  RiskLevel;
}

export function ScoreGauge({ score, risk }: Props) {
  const { label, color, track, bg, pct } = RISK_CONFIG[risk];

  return (
    <div className="flex items-center gap-5 w-full">
      {/* Score circle */}
      <div className={cn("flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl", bg)}>
        <span className={cn("text-2xl font-bold tabular-nums leading-none", color)}>{score}</span>
        <span className="text-[10px] text-muted-foreground mt-0.5">score</span>
      </div>

      {/* Bar + label */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk level</span>
          <span className={cn("text-sm font-semibold tracking-wide", color)}>{label}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", track)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>SAFE</span>
          <span>MEDIUM</span>
          <span>HIGH</span>
        </div>
      </div>
    </div>
  );
}
