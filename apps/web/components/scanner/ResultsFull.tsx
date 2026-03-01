"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, Loader2, AlertTriangle, Zap, Download, Lock } from "lucide-react";
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScoreGauge }    from "./ScoreGauge";
import { exportScanJSON } from "@/lib/scanner";
import type { Finding, ScanResult } from "@/types/scanner";
import type { SaveStatus } from "./ScanOrchestrator";

// ── Finding components ───────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  high:   { dot: "bg-red-500",   badge: "destructive" as const },
  medium: { dot: "bg-amber-500", badge: "secondary"   as const },
  low:    { dot: "bg-blue-500",  badge: "outline"     as const },
};

function FindingRow({ finding }: { finding: Finding }) {
  const { dot } = LEVEL_CONFIG[finding.level];
  return (
    <div className="flex items-start gap-2.5 text-sm py-1.5">
      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${dot}`} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium">{finding.message}</span>
        <span className="text-xs text-muted-foreground font-mono truncate">{finding.file}</span>
      </div>
    </div>
  );
}

function FindingGroup({
  level,
  label,
  findings,
}: {
  level: "high" | "medium" | "low";
  label: string;
  findings: Finding[];
}) {
  if (findings.length === 0) return null;
  const { badge } = LEVEL_CONFIG[level];
  return (
    <div className="flex flex-col gap-1">
      <Badge variant={badge} className="text-xs self-start">{label} · {findings.length}</Badge>
      <div className="flex flex-col divide-y divide-border/50">
        {findings.map((f, i) => <FindingRow key={`${f.ruleId}-${i}`} finding={f} />)}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  result:     ScanResult;
  isPro:      boolean;
  saveStatus: SaveStatus;
}

export function ResultsFull({ result, isPro, saveStatus }: Props) {
  const t = useTranslations("scanner");
  const { score, risk, summary, findings, filesScanned, rulesTriggered, generatedAt } = result;

  const byLevel = {
    high:   findings.filter(f => f.level === "high"),
    medium: findings.filter(f => f.level === "medium"),
    low:    findings.filter(f => f.level === "low"),
  };

  // ── Save status indicator ──────────────────────────────────────────────────
  const SaveIndicator = () => {
    if (saveStatus === "idle") return null;
    if (saveStatus === "saving") return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> {t("saveStatus.saving")}
      </span>
    );
    if (saveStatus === "saved") return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        <Check className="h-3 w-3" /> {t("saveStatus.saved")}
      </span>
    );
    if (saveStatus === "limit") return (
      <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3" />
        {t("saveStatus.limitReached")} ·{" "}
        <Link href="/upgrade" className="underline underline-offset-2">{t("saveStatus.upgrade")}</Link>
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="h-3 w-3" /> {t("saveStatus.notSaved")}
      </span>
    );
  };

  // ── PRO locked features preview ────────────────────────────────────────────
  const ProLockedPreview = () => {
    const previewJson = JSON.stringify({
      score:          result.score,
      risk:           result.risk,
      filesScanned:   result.filesScanned,
      summary:        result.summary,
      rulesTriggered: result.rulesTriggered,
      findings:       result.findings.map(f => ({
        rule: f.ruleId, level: f.level, file: f.file,
      })),
    }, null, 2);

    const proFeatures = [
      { label: t("pro.featureUnlimited"), sub: t("pro.featureUnlimitedSub") },
      { label: t("pro.featureHistory"),   sub: t("pro.featureHistorySub") },
      { label: t("pro.featureTrend"),     sub: t("pro.featureTrendSub") },
      { label: t("pro.featureStats"),     sub: t("pro.featureStatsSub") },
    ];

    return (
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="pb-2 border-b border-border/40 bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-primary" />
              {t("pro.featuresTitle")}
            </CardTitle>
            <Button asChild size="sm" className="h-7 text-xs gap-1.5">
              <Link href="/upgrade">
                <Zap className="h-3 w-3" /> {t("pro.upgradeBtn")}
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/40">

          {/* Locked: JSON export */}
          <div className="relative overflow-hidden">
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Download className="h-3 w-3" /> {t("pro.exportTitle")}
              </p>
            </div>
            <div className="relative mx-4 mb-4">
              <pre className="text-[10px] font-mono rounded-lg border border-border/50 bg-muted/40 p-3 overflow-hidden max-h-28 select-none blur-[3px] pointer-events-none leading-relaxed">
                {previewJson}
              </pre>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-background/70 backdrop-blur-[1px]">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-xs font-medium">{t("pro.exportLock")}</p>
              </div>
            </div>
          </div>

          {/* Locked: other PRO features */}
          <div className="px-4 py-3 flex flex-col gap-2.5">
            <p className="text-xs font-medium text-muted-foreground">{t("pro.alsoUnlocked")}</p>
            <div className="grid grid-cols-2 gap-2">
              {proFeatures.map(({ label, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-2 rounded-lg border border-dashed border-border/60 px-2.5 py-2"
                >
                  <Lock className="h-3 w-3 text-muted-foreground/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium leading-tight">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">

      {/* ── Score ───────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1"><ScoreGauge score={score} risk={risk} /></div>
            {isPro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary shrink-0">
                <Zap className="h-2.5 w-2.5" /> {t("pro.badge")}
              </span>
            )}
          </div>
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

          <div className="flex flex-wrap gap-1.5">
            {rulesTriggered.map(id => (
              <Badge key={id} variant="outline" className="font-mono text-[10px]">{id}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground">
              {t("filesScanned", { count: filesScanned })}
              {generatedAt && <> · {new Date(generatedAt).toLocaleString()}</>}
            </p>
            <SaveIndicator />
          </div>
        </CardContent>
      </Card>

      {/* ── Findings ────────────────────────────────────────────────────── */}
      {findings.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {t("findings")}
              <span className="ml-2 text-muted-foreground font-normal text-sm">({findings.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FindingGroup level="high"   label={t("levels.high")}   findings={byLevel.high}   />
            {byLevel.high.length > 0 && byLevel.medium.length > 0 && <Separator />}
            <FindingGroup level="medium" label={t("levels.medium")} findings={byLevel.medium} />
            {(byLevel.high.length > 0 || byLevel.medium.length > 0) && byLevel.low.length > 0 && <Separator />}
            <FindingGroup level="low"    label={t("levels.low")}    findings={byLevel.low}    />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            {t("noFindings")}
          </CardContent>
        </Card>
      )}

      {/* ── PRO export (Mode C) or locked preview (Mode B) ──────────────── */}
      {isPro ? (
        <Button variant="outline" size="sm" className="self-start gap-2" onClick={() => exportScanJSON(result)}>
          <Download className="h-3.5 w-3.5" /> {t("pro.exportBtn")}
        </Button>
      ) : (
        <ProLockedPreview />
      )}

      {/* Trust reminder */}
      <p className="text-xs text-muted-foreground text-center">
        {t("trust")}{" "}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">{t("trustLink")}</Link>
      </p>

    </div>
  );
}
