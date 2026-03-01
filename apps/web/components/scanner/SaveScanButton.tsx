"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ScanResult } from "@/types/scanner";

type State = "idle" | "saving" | "saved" | "limit" | "error";

interface Props {
  result: ScanResult;
}

export function SaveScanButton({ result }: Props) {
  const [state,  setState]  = useState<State>("idle");
  const [scanId, setScanId] = useState<string | null>(null);

  async function handleSave() {
    setState("saving");

    const id = uuid();
    try {
      const res = await fetch("/api/scans", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanId:         id,
          summary:        result.summary,
          score:          result.score,
          risk:           result.risk,
          rulesTriggered: result.rulesTriggered,
          filesScanned:   result.filesScanned,
        }),
      });

      if (res.status === 429) {
        setState("limit");
        return;
      }
      if (!res.ok) throw new Error("Save failed");

      setScanId(id);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  if (state === "saved" && scanId) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-green-600">✓ Saved to history</span>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/dashboard/${scanId}`}>View in dashboard →</Link>
        </Button>
      </div>
    );
  }

  if (state === "limit") {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-yellow-600">Monthly limit reached</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/upgrade">Upgrade to PRO</Link>
        </Button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-destructive">Failed to save</span>
        <Button variant="ghost" size="sm" onClick={() => setState("idle")}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={state === "saving"}
      >
        {state === "saving" ? "Saving…" : "Save to history"}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Saves: score, severity counts, rules triggered. No file contents.
      </p>
    </div>
  );
}
