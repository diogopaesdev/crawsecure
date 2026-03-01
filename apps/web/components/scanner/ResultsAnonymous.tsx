"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
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

// Feature comparison — labelKey is a typed next-intl key for t()
type AnonLabelKey =
  | "anonymous.riskScore" | "anonymous.severityCounts" | "anonymous.ruleNames"
  | "anonymous.filesAffected" | "anonymous.autoSave" | "anonymous.tenScans"
  | "anonymous.unlimited" | "anonymous.fullHistory" | "anonymous.trendChart"
  | "anonymous.jsonExport";

type FeatureRow = {
  labelKey: AnonLabelKey;
  anon: "yes" | "no" | "lock";
  free: "yes" | "no";
  pro:  "yes" | "no";
};

const FEATURES: FeatureRow[] = [
  { labelKey: "anonymous.riskScore",      anon: "yes",  free: "yes", pro: "yes" },
  { labelKey: "anonymous.severityCounts", anon: "yes",  free: "yes", pro: "yes" },
  { labelKey: "anonymous.ruleNames",      anon: "lock", free: "yes", pro: "yes" },
  { labelKey: "anonymous.filesAffected",  anon: "lock", free: "yes", pro: "yes" },
  { labelKey: "anonymous.autoSave",       anon: "no",   free: "yes", pro: "yes" },
  { labelKey: "anonymous.tenScans",       anon: "no",   free: "yes", pro: "yes" },
  { labelKey: "anonymous.unlimited",      anon: "no",   free: "no",  pro: "yes" },
  { labelKey: "anonymous.fullHistory",    anon: "no",   free: "no",  pro: "yes" },
  { labelKey: "anonymous.trendChart",     anon: "no",   free: "no",  pro: "yes" },
  { labelKey: "anonymous.jsonExport",     anon: "no",   free: "no",  pro: "yes" },
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
  const t = useTranslations("scanner");
  const { score, risk, summary, filesScanned } = result;
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
              <strong>{summary.critical}</strong> {t("levels.high")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <strong>{summary.warning}</strong> {t("levels.medium")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <strong>{summary.info}</strong> {t("levels.low")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("filesScanned", { count: filesScanned })}
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
                {t("anonymous.issuesFound", { count: totalIssues })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Tier comparison ────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] items-center border-b border-border/60 bg-muted/40">
          <div className="px-4 py-2.5 text-xs font-medium text-muted-foreground">{t("anonymous.tableFeature")}</div>
          <div className="w-20 px-2 py-2.5 text-center text-xs font-medium text-muted-foreground">{t("anonymous.tableNow")}</div>
          <div className="w-20 px-2 py-2.5 text-center text-xs font-semibold text-foreground">{t("anonymous.tableFree")}</div>
          <div className="w-20 px-2 py-2.5 text-center">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" /> {t("anonymous.tablePro")}
            </span>
          </div>
        </div>

        <div className="divide-y divide-border/40">
          {FEATURES.map(({ labelKey, anon, free, pro }) => (
            <div key={labelKey} className="grid grid-cols-[1fr_auto_auto_auto] items-center">
              <span className="px-4 py-2 text-xs text-muted-foreground">
                {t(labelKey)}
              </span>
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
              {t("anonymous.signIn")}
            </Button>
          </div>
          <div className="w-20 text-center">
            <Button
              size="sm"
              className="h-7 text-xs w-full gap-1"
              asChild
            >
              <a href="/upgrade">
                <Zap className="h-3 w-3" /> {t("anonymous.tablePro")}
              </a>
            </Button>
          </div>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        {t("trust")}
      </p>
    </div>
  );
}
