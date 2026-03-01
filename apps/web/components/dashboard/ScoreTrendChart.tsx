"use client";

// Pure-SVG sparkline — no chart library dependency.
// Shows score evolution across the user's last N scans (oldest → newest).

interface Point {
  score:     number;
  createdAt: string;
}

interface Props {
  scans: Point[];
}

export function ScoreTrendChart({ scans }: Props) {
  if (scans.length < 2) return null;

  // API returns scans newest-first; reverse for left-to-right chronology.
  const sorted = [...scans].reverse();
  const scores = sorted.map((s) => s.score);

  const W   = 300;
  const H   = 56;
  const PAD = 6;

  const max   = Math.max(...scores);
  const min   = Math.min(...scores);
  const range = max - min || 1;

  const pts = scores.map((s, i) => {
    const x = PAD + (i / (scores.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((s - min) / range) * (H - PAD * 2);
    return [x, y] as [number, number];
  });

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(" ");

  const first = scores[0];
  const last  = scores[scores.length - 1];
  const delta = last - first;

  // Green when improving (score going down), red when worsening
  const improving = delta < 0;
  const flat      = delta === 0;
  const color     = flat ? "#6b7280" : improving ? "#16a34a" : "#dc2626";
  const arrow     = flat ? "→" : improving ? "↓" : "↑";
  const label     = flat
    ? "Score stable"
    : `Score ${improving ? "improving" : "worsening"} (${delta > 0 ? "+" : ""}${delta})`;

  const [lastX, lastY] = pts[pts.length - 1];

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">
        {arrow} {label}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible"
        style={{ height: H }}
        aria-hidden
      >
        <polyline
          points={polyline}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle cx={lastX} cy={lastY} r="3.5" fill={color} />
      </svg>
    </div>
  );
}
