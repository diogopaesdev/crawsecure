"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone }     from "./FileDropzone";
import { ResultsAnonymous } from "./ResultsAnonymous";
import { ResultsFull }      from "./ResultsFull";
import { parseCrawsecureJson, runBrowserScan } from "@/lib/scanner";
import type { ScanResult } from "@/types/scanner";

const PENDING_KEY       = "CRAWSECURE_PENDING_SCAN";
const GUEST_SCANS_KEY   = "crawsecure_guest_scans";
const GUEST_SCAN_LIMIT  = 3;

type ScanState =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "done"; result: ScanResult }
  | { status: "error"; message: string };

export type SaveStatus = "idle" | "saving" | "saved" | "limit" | "error";

function isCrawsecureJson(files: FileList): boolean {
  return files.length === 1 && files[0].name === "crawsecure.json";
}

function getGuestCount(): number {
  try { return parseInt(localStorage.getItem(GUEST_SCANS_KEY) ?? "0", 10) || 0; }
  catch { return 0; }
}

function incrementGuestCount(): number {
  const next = getGuestCount() + 1;
  try { localStorage.setItem(GUEST_SCANS_KEY, String(next)); } catch {}
  return next;
}

export function ScanOrchestrator() {
  const { data: session, status: sessionStatus } = useSession();
  const [state,      setState]      = useState<ScanState>({ status: "idle" });
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [guestCount, setGuestCount] = useState(0);
  const savedRef = useRef(false);
  const t  = useTranslations("scanner");
  const tc = useTranslations("common");

  // Init guest count from localStorage
  useEffect(() => { setGuestCount(getGuestCount()); }, []);

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
    // Block scan if guest limit reached
    if (!session && getGuestCount() >= GUEST_SCAN_LIMIT) return;

    setState({ status: "scanning" });
    savedRef.current = false;
    setSaveStatus("idle");

    try {
      const result = isCrawsecureJson(files)
        ? parseCrawsecureJson(await files[0].text())
        : await runBrowserScan(files);

      // Increment guest count after successful scan
      if (!session) {
        const next = incrementGuestCount();
        setGuestCount(next);
      }

      setState({ status: "done", result });
    } catch (err) {
      setState({
        status:  "error",
        message: err instanceof Error ? err.message : "Failed to process files.",
      });
    }
  }, [session]);

  const reset = useCallback(() => {
    setState({ status: "idle" });
    setSaveStatus("idle");
    savedRef.current = false;
  }, []);

  // ── Idle ────────────────────────────────────────────────────────────────
  if (state.status === "idle") {
    // Guest limit gate
    if (sessionStatus !== "loading" && !session && guestCount >= GUEST_SCAN_LIMIT) {
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-center max-w-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/40">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium">{t("anonymous.guestLimitTitle")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("anonymous.guestLimitBody")}</p>
          </div>
          <Button onClick={() => signIn("github", { callbackUrl: "/analyze" })} className="gap-2">
            {t("anonymous.signIn")}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-6">
        <FileDropzone onFiles={handleFiles} />
        {!session && guestCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {t("anonymous.guestUsed", { used: guestCount, limit: GUEST_SCAN_LIMIT })}
            {" · "}
            <button
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => signIn("github", { callbackUrl: "/analyze" })}
            >
              {t("anonymous.signInForMore")}
            </button>
          </p>
        )}
        <div className="text-xs text-muted-foreground text-center max-w-sm">
          <strong>{t("tip.prefix")}</strong> {t("tip.body")}
          <br />
          <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] mt-1 inline-block">
            {t("tip.cmd")}
          </code>
          <br />
          {t("tip.suffix")}
        </div>
      </div>
    );
  }

  // ── Scanning ─────────────────────────────────────────────────────────────
  if (state.status === "scanning") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-muted-foreground">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm">{t("scanning")}</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-sm text-destructive">{state.message}</p>
        <Button variant="outline" size="sm" onClick={reset}>{tc("tryAgain")}</Button>
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
        <ResultsAnonymous result={result} guestCount={guestCount} guestLimit={GUEST_SCAN_LIMIT} />
      )}
      <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
        {t("scanAnother")}
      </Button>
    </div>
  );
}
