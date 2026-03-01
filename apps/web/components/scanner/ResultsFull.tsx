"use client";

import Link from "next/link";
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
  high:   { dot: "bg-red-500",   label: "Critical", badge: "destructive" as const },
  medium: { dot: "bg-amber-500", label: "Warning",  badge: "secondary"   as const },
  low:    { dot: "bg-blue-500",  label: "Info",     badge: "outline"     as const },
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

function FindingGroup({ level, findings }: { level: "high" | "medium" | "low"; findings: Finding[] }) {
  if (findings.length === 0) return null;
  const { label, badge } = LEVEL_CONFIG[level];
  return (
    <div className="flex flex-col gap-1">
      <Badge variant={badge} className="text-xs self-start">{label} · {findings.length}</Badge>
      <div className="flex flex-col divide-y divide-border/50">
        {findings.map((f, i) => <FindingRow key={`${f.ruleId}-${i}`} finding={f} />)}
      </div>
    </div>
  );
}

// ── Save status indicator ────────────────────────────────────────────────────

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  if (status === "saving") return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 className="h-3 w-3 animate-spin" /> Saving…
    </span>
  );
  if (status === "saved") return (
    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
      <Check className="h-3 w-3" /> Saved to dashboard
    </span>
  );
  if (status === "limit") return (
    <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
      <AlertTriangle className="h-3 w-3" />
      Monthly limit reached ·{" "}
      <Link href="/upgrade" className="underline underline-offset-2">Upgrade</Link>
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <AlertTriangle className="h-3 w-3" /> Not saved
    </span>
  );
}

// ── PRO locked features preview (Mode B only) ─────────────────────────────

function ProLockedPreview({ result }: { result: ScanResult }) {
  // Generate what the export JSON would look like for this scan
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

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="pb-2 border-b border-border/40 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            PRO features for this scan
          </CardTitle>
          <Button asChild size="sm" className="h-7 text-xs gap-1.5">
            <Link href="/upgrade">
              <Zap className="h-3 w-3" /> Upgrade · $9/mo
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/40">

        {/* Locked: JSON export */}
        <div className="relative overflow-hidden">
          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Download className="h-3 w-3" /> Export this scan as JSON
            </p>
          </div>
          <div className="relative mx-4 mb-4">
            {/* Blurred JSON preview */}
            <pre className="text-[10px] font-mono rounded-lg border border-border/50 bg-muted/40 p-3 overflow-hidden max-h-28 select-none blur-[3px] pointer-events-none leading-relaxed">
              {previewJson}
            </pre>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-background/70 backdrop-blur-[1px]">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-xs font-medium">Unlock JSON export with PRO</p>
            </div>
          </div>
        </div>

        {/* Locked: other PRO features */}
        <div className="px-4 py-3 flex flex-col gap-2.5">
          <p className="text-xs font-medium text-muted-foreground">Also unlocked with PRO</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Unlimited scans",       sub: "vs 10 / month" },
              { label: "Full history (50)",      sub: "vs last 5 only" },
              { label: "Score trend chart",      sub: "track progress" },
              { label: "Advanced rule stats",    sub: "avg · best · top rule" },
            ].map(({ label, sub }) => (
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
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  result:     ScanResult;
  isPro:      boolean;
  saveStatus: SaveStatus;
}

export function ResultsFull({ result, isPro, saveStatus }: Props) {
  const { score, risk, summary, findings, filesScanned, rulesTriggered, generatedAt } = result;

  const byLevel = {
    high:   findings.filter(f => f.level === "high"),
    medium: findings.filter(f => f.level === "medium"),
    low:    findings.filter(f => f.level === "low"),
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
                <Zap className="h-2.5 w-2.5" /> PRO
              </span>
            )}
          </div>
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

          <div className="flex flex-wrap gap-1.5">
            {rulesTriggered.map(id => (
              <Badge key={id} variant="outline" className="font-mono text-[10px]">{id}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground">
              {filesScanned} file{filesScanned !== 1 ? "s" : ""} scanned
              {generatedAt && <> · {new Date(generatedAt).toLocaleString()}</>}
            </p>
            <SaveIndicator status={saveStatus} />
          </div>
        </CardContent>
      </Card>

      {/* ── Findings ────────────────────────────────────────────────────── */}
      {findings.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Findings
              <span className="ml-2 text-muted-foreground font-normal text-sm">({findings.length})</span>
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
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            ✅ No security signals found. This skill looks safe.
          </CardContent>
        </Card>
      )}

      {/* ── PRO export (Mode C) or locked preview (Mode B) ──────────────── */}
      {isPro ? (
        <Button variant="outline" size="sm" className="self-start gap-2" onClick={() => exportScanJSON(result)}>
          <Download className="h-3.5 w-3.5" /> Export JSON
        </Button>
      ) : (
        <ProLockedPreview result={result} />
      )}

      {/* Trust reminder */}
      <p className="text-xs text-muted-foreground text-center">
        This scan ran entirely in your browser. No files were uploaded.{" "}
        <Link href="/trust" className="underline underline-offset-2 hover:text-foreground">Learn more →</Link>
      </p>

    </div>
  );
}
