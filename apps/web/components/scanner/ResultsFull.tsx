"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScoreGauge }      from "./ScoreGauge";
import { SaveScanButton }  from "./SaveScanButton";
import { exportScanJSON }  from "@/lib/scanner";
import type { Finding, ScanResult } from "@/types/scanner";

const LEVEL_CONFIG = {
  high:   { icon: "🔴", label: "Critical", badge: "destructive" as const },
  medium: { icon: "🟡", label: "Warning",  badge: "secondary"   as const },
  low:    { icon: "🔵", label: "Info",     badge: "outline"     as const },
};

function FindingRow({ finding }: { finding: Finding }) {
  const { icon } = LEVEL_CONFIG[finding.level];
  return (
    <div className="flex items-start gap-2 text-sm py-1.5">
      <span className="shrink-0 mt-0.5">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium">{finding.message}</span>
        <span className="text-xs text-muted-foreground font-mono truncate">
          {finding.file}
        </span>
      </div>
    </div>
  );
}

function FindingGroup({
  level,
  findings,
}: {
  level: "high" | "medium" | "low";
  findings: Finding[];
}) {
  if (findings.length === 0) return null;
  const { label, badge } = LEVEL_CONFIG[level];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Badge variant={badge} className="text-xs">
          {label} · {findings.length}
        </Badge>
      </div>
      <div className="flex flex-col divide-y divide-border/60">
        {findings.map((f, i) => (
          <FindingRow key={`${f.ruleId}-${i}`} finding={f} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  result: ScanResult;
  isPro:  boolean;
}

export function ResultsFull({ result, isPro }: Props) {
  const { score, risk, summary, findings, filesScanned, rulesTriggered, generatedAt } = result;

  const byLevel = {
    high:   findings.filter(f => f.level === "high"),
    medium: findings.filter(f => f.level === "medium"),
    low:    findings.filter(f => f.level === "low"),
  };

  const totalIssues = findings.length;

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">

      {/* Score */}
      <Card>
        <CardHeader className="pb-2">
          <ScoreGauge score={score} risk={risk} />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              🔴 <strong>{summary.critical}</strong> Critical
            </span>
            <span className="flex items-center gap-1.5">
              🟡 <strong>{summary.warning}</strong> Warnings
            </span>
            <span className="flex items-center gap-1.5">
              🔵 <strong>{summary.info}</strong> Info
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {rulesTriggered.map(id => (
              <Badge key={id} variant="outline" className="font-mono text-[10px]">
                {id}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {filesScanned} file{filesScanned !== 1 ? "s" : ""} scanned
            {generatedAt && (
              <> · generated {new Date(generatedAt).toLocaleString()}</>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Findings */}
      {totalIssues > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Findings
              <span className="ml-2 text-muted-foreground font-normal text-sm">
                ({totalIssues})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FindingGroup level="high"   findings={byLevel.high}   />
            {byLevel.high.length > 0 && byLevel.medium.length > 0 && <Separator />}
            <FindingGroup level="medium" findings={byLevel.medium} />
            {(byLevel.high.length > 0 || byLevel.medium.length > 0) && byLevel.low.length > 0 && <Separator />}
            <FindingGroup level="low"    findings={byLevel.low}    />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            ✅ No security signals found. This skill looks safe.
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-start gap-3">
        <SaveScanButton result={result} />

        {isPro ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportScanJSON(result)}
          >
            Export JSON
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <a href="/upgrade">
              Export JSON{" "}
              <Badge variant="secondary" className="ml-1.5 text-[10px]">PRO</Badge>
            </a>
          </Button>
        )}
      </div>

      {/* Trust reminder */}
      <p className="text-xs text-muted-foreground text-center">
        This scan ran entirely in your browser. No files were uploaded.{" "}
        <a href="/trust" className="underline underline-offset-2 hover:text-foreground">
          Learn more →
        </a>
      </p>
    </div>
  );
}
