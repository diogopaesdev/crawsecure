"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";
import { Badge }   from "@/components/ui/badge";
import { Button }  from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScoreGauge } from "./ScoreGauge";
import type { Finding, ScanResult } from "@/types/scanner";

const PENDING_KEY = "CRAWSECURE_PENDING_SCAN";

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

interface Props {
  result:     ScanResult;
  guestCount: number;
  guestLimit: number;
}

export function ResultsAnonymous({ result, guestCount, guestLimit }: Props) {
  const t = useTranslations("scanner");
  const { score, risk, summary, findings, filesScanned, rulesTriggered } = result;

  const byLevel = {
    high:   findings.filter(f => f.level === "high"),
    medium: findings.filter(f => f.level === "medium"),
    low:    findings.filter(f => f.level === "low"),
  };

  const remaining = guestLimit - guestCount;

  function handleSignIn() {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(result));
    signIn("github", { callbackUrl: "/analyze" });
  }

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">

      {/* ── Score ───────────────────────────────────────────────────────── */}
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

          <div className="flex flex-wrap gap-1.5">
            {rulesTriggered.map(id => (
              <Badge key={id} variant="outline" className="font-mono text-[10px]">{id}</Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {t("filesScanned", { count: filesScanned })}
          </p>
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

      {/* ── Guest CTA ───────────────────────────────────────────────────── */}
      <Card className="overflow-hidden border-border/60">
        <CardContent className="pt-4 flex flex-col gap-3">

          {/* Scan counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("anonymous.guestUsed", { used: guestCount, limit: guestLimit })}</span>
            {remaining > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {t("anonymous.guestRemaining", { remaining })}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all"
              style={{ width: `${(guestCount / guestLimit) * 100}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">{t("anonymous.guestCtaBody")}</p>

          {/* CTAs */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={handleSignIn}>
              {t("anonymous.signIn")}
            </Button>
            <Button size="sm" className="flex-1 h-8 text-xs gap-1" asChild>
              <Link href="/upgrade">
                <Zap className="h-3 w-3" /> {t("anonymous.upgradePro")}
              </Link>
            </Button>
          </div>

        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        {t("trust")}{" "}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">{t("trustLink")}</Link>
      </p>

    </div>
  );
}
