"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FileDropzone }     from "./FileDropzone";
import { ResultsAnonymous } from "./ResultsAnonymous";
import { ResultsFull }      from "./ResultsFull";
import { parseCrawsecureJson, runBrowserScan } from "@/lib/scanner";
import type { ScanResult } from "@/types/scanner";

const PENDING_KEY = "CRAWSECURE_PENDING_SCAN";

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "done"; result: ScanResult }
  | { status: "error"; message: string };

export type SaveStatus = "idle" | "saving" | "saved" | "limit" | "error";

function isCrawsecureJson(files: FileList): boolean {
  return files.length === 1 && files[0].name === "crawsecure.json";
}

export function ScanOrchestrator() {
  const { data: session, status: sessionStatus } = useSession();
  const [state,      setState]      = useState<ScanState>({ status: "idle" });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedRef = useRef(false); // prevent double-save in StrictMode

  // Restore scan result after OAuth redirect
  useEffect(() => {
    if (sessionStatus === "loading") return;
    const stored = sessionStorage.getItem(PENDING_KEY);
    if (!stored) return;
    sessionStorage.removeItem(PENDING_KEY);
    try {
      const result = JSON.parse(stored) as ScanResult;
      setState({ status: "done", result });
    } catch { /* ignore */ }
  }, [sessionStatus]);

  // Auto-save when scan is done and user is logged in
  useEffect(() => {
    if (state.status !== "done") return;
    if (!session)                return;
    if (savedRef.current)        return;

    savedRef.current = true;
    setSaveStatus("saving");

    const { result } = state;

    fetch("/api/scans", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scanId:         crypto.randomUUID(),
        summary:        result.summary,
        score:          result.score,
        risk:           result.risk,
        rulesTriggered: result.rulesTriggered,
        filesScanned:   result.filesScanned,
      }),
    })
      .then(res => setSaveStatus(res.status === 429 ? "limit" : res.ok ? "saved" : "error"))
      .catch(() => setSaveStatus("error"));
  }, [state.status, session]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiles = useCallback(async (files: FileList) => {
    setState({ status: "scanning" });
    savedRef.current = false;
    setSaveStatus("idle");

    try {
      const result = isCrawsecureJson(files)
        ? parseCrawsecureJson(await files[0].text())
        : await runBrowserScan(files);

      setState({ status: "done", result });
    } catch (err) {
      setState({
        status:  "error",
        message: err instanceof Error ? err.message : "Failed to process files.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle" });
    setSaveStatus("idle");
    savedRef.current = false;
  }, []);

  // ── Idle ────────────────────────────────────────────────────────────────
  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center gap-6">
        <FileDropzone onFiles={handleFiles} />
        <div className="text-xs text-muted-foreground text-center max-w-sm">
          <strong>Tip:</strong> generate a report with the CLI first:
          <br />
          <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] mt-1 inline-block">
            crawsecure ./my-skill --output crawsecure.json
          </code>
          <br />
          then drop the file above for full visualization.
        </div>
      </div>
    );
  }

  // ── Scanning ─────────────────────────────────────────────────────────────
  if (state.status === "scanning") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-muted-foreground">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm">Scanning locally — nothing is uploaded…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-sm text-destructive">{state.message}</p>
        <Button variant="outline" size="sm" onClick={reset}>Try again</Button>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  const { result } = state;
  const isPro = session?.user.plan === "pro";

  return (
    <div className="flex flex-col items-center gap-4">
      {session ? (
        <ResultsFull result={result} isPro={isPro} saveStatus={saveStatus} />
      ) : (
        <ResultsAnonymous result={result} />
      )}
      <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
        ← Scan another skill
      </Button>
    </div>
  );
}
