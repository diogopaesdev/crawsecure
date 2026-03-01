"use client";

import { signIn } from "next-auth/react";
import { Check, Minus, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreGauge } from "./ScoreGauge";
import type { ScanResult } from "@/types/scanner";

const LEVEL_DOT: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-amber-500",
  low:    "bg-blue-500",
};

// Feature comparison data
type FeatureRow = {
  label:     string;
  anon:      "yes" | "no" | "lock";
  free:      "yes" | "no";
  pro:       "yes" | "no";
};

const FEATURES: FeatureRow[] = [
  { label: "Risk score",            anon: "yes",  free: "yes", pro: "yes" },
  { label: "Severity counts",       anon: "yes",  free: "yes", pro: "yes" },
  { label: "Rule names triggered",  anon: "lock", free: "yes", pro: "yes" },
  { label: "Files affected",        anon: "lock", free: "yes", pro: "yes" },
  { label: "Auto-save to history",  anon: "no",   free: "yes", pro: "yes" },
  { label: "10 scans / month",      anon: "no",   free: "yes", pro: "yes" },
  { label: "Unlimited scans",       anon: "no",   free: "no",  pro: "yes" },
  { label: "Full history (50)",     anon: "no",   free: "no",  pro: "yes" },
  { label: "Score trend chart",     anon: "no",   free: "no",  pro: "yes" },
  { label: "JSON export",           anon: "no",   free: "no",  pro: "yes" },
];

function Cell({ value }: { value: "yes" | "no" | "lock" }) {
  if (value === "yes")  return <Check className="h-3.5 w-3.5 text-emerald-500 mx-auto" />;
  if (value === "lock") return <Lock  className="h-3 w-3 text-amber-500 mx-auto" />;
  return <Minus className="h-3 w-3 text-muted-foreground/40 mx-auto" />;
}

interface Props {
  result: ScanResult;
}

export function ResultsAnonymous({ result }: Props) {
  const { score, risk, summary, findings, filesScanned } = result;
  const totalIssues = summary.critical + summary.warning + summary.info;

  const placeholderRows = [
    ...Array(Math.min(summary.critical, 4)).fill("high"),
    ...Array(Math.min(summary.warning,  3)).fill("medium"),
    ...Array(Math.min(summary.info,     2)).fill("low"),
  ];

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">

      {/* ── Score card ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <ScoreGauge score={score} risk={risk} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-5 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <strong>{summary.critical}</strong> Critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <strong>{summary.warning}</strong> Warnings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <strong>{summary.info}</strong> Info
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {filesScanned} file{filesScanned !== 1 ? "s" : ""} scanned
          </p>
        </CardContent>
      </Card>

      {/* ── Blurred findings ───────────────────────────────────────────── */}
      {totalIssues > 0 && (
        <Card className="relative overflow-hidden">
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2 select-none">
              {placeholderRows.map((level, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm blur-sm pointer-events-none"
                  aria-hidden
                >
                  <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${LEVEL_DOT[level]}`} />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium font-mono text-xs bg-muted rounded px-1">
                      {level === "high" ? "eval" : level === "medium" ? "child-process" : "process-env"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      src/affected/file.js · line {10 + i * 7}
                    </span>
                  </div>
                </div>
              ))}
              {totalIssues > placeholderRows.length && (
                <p className="text-xs text-muted-foreground blur-sm">
                  +{totalIssues - placeholderRows.length} more issues…
                </p>
              )}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/75 backdrop-blur-[3px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40">
                <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-sm font-medium text-center px-6">
                {totalIssues} issue{totalIssues !== 1 ? "s" : ""} found — sign in free to see exactly which rules fired
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Tier comparison ────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center border-b border-border/60 bg-muted/40">
          <div className="px-4 py-2.5 text-xs font-medium text-muted-foreground">Feature</div>
          <div className="w-20 px-2 py-2.5 text-center text-xs font-medium text-muted-foreground">Now</div>
          <div className="w-20 px-2 py-2.5 text-center text-xs font-semibold text-foreground">Free</div>
          <div className="w-20 px-2 py-2.5 text-center">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" /> PRO
            </span>
          </div>
        </div>

        <div className="divide-y divide-border/40">
          {FEATURES.map(({ label, anon, free, pro }) => (
            <div key={label} className="grid grid-cols-[1fr_auto_auto_auto] items-center">
              <span className="px-4 py-2 text-xs text-muted-foreground">{label}</span>
              <div className="w-20 py-2 text-center"><Cell value={anon} /></div>
              <div className="w-20 py-2 text-center"><Cell value={free} /></div>
              <div className="w-20 py-2 text-center bg-primary/[0.03]"><Cell value={pro} /></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center border-t border-border/60 bg-muted/20 px-4 py-3 gap-2">
          <div />
          <div className="w-20" />
          <div className="w-20 text-center">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs w-full"
              onClick={() => {
                sessionStorage.setItem("CRAWSECURE_PENDING_SCAN", JSON.stringify(result));
                signIn("github", { callbackUrl: "/analyze" });
              }}
            >
              Sign in
            </Button>
          </div>
          <div className="w-20 text-center">
            <Button
              size="sm"
              className="h-7 text-xs w-full gap-1"
              asChild
            >
              <a href="/upgrade">
                <Zap className="h-3 w-3" /> PRO
              </a>
            </Button>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        This scan ran entirely in your browser — no files were uploaded.
      </p>
    </div>
  );
}
