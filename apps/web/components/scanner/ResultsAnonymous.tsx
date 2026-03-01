"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreGauge } from "./ScoreGauge";
import type { ScanResult } from "@/types/scanner";

const LEVEL_ICON: Record<string, string> = {
  high:   "🔴",
  medium: "🟡",
  low:    "🔵",
};

const LEVEL_LABEL: Record<string, string> = {
  high:   "Critical",
  medium: "Warning",
  info:   "Info",
};

interface Props {
  result: ScanResult;
}

export function ResultsAnonymous({ result }: Props) {
  const { score, risk, summary, filesScanned } = result;
  const totalIssues = summary.critical + summary.warning + summary.info;

  // Fake rows that look like real findings — drives curiosity
  const placeholderRows = [
    ...Array(summary.critical).fill("high"),
    ...Array(summary.warning).fill("medium"),
    ...Array(summary.info).fill("low"),
  ];

  return (
    <div className="w-full max-w-xl flex flex-col gap-4">

      {/* Score card */}
      <Card>
        <CardHeader className="pb-2">
          <ScoreGauge score={score} risk={risk} />
        </CardHeader>
        <CardContent>
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
          <p className="text-xs text-muted-foreground mt-2">
            {filesScanned} file{filesScanned !== 1 ? "s" : ""} scanned
          </p>
        </CardContent>
      </Card>

      {/* Blurred findings with overlay */}
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
                  <span className="shrink-0 mt-0.5">{LEVEL_ICON[level]}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">
                      {LEVEL_LABEL[level]} — rule name hidden
                    </span>
                    <span className="text-xs text-muted-foreground">
                      path/to/affected/file.js · line XX
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Overlay CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-[2px]">
              <p className="text-sm font-medium text-center px-4">
                {totalIssues} issue{totalIssues !== 1 ? "s" : ""} found.
                Sign in to see which rules were triggered and which files are affected.
              </p>
              <Button
                onClick={() => {
                  sessionStorage.setItem("CRAWSECURE_PENDING_SCAN", JSON.stringify(result));
                  signIn("github", { callbackUrl: "/analyze" });
                }}
                className="gap-2"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Sign in with GitHub — it&apos;s free
              </Button>
              <p className="text-xs text-muted-foreground">No credit card. No uploads.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {totalIssues === 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          ✅ No issues found in this scan.
        </div>
      )}
    </div>
  );
}
