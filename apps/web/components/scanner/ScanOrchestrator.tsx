"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FileDropzone }       from "./FileDropzone";
import { ResultsAnonymous }   from "./ResultsAnonymous";
import { ResultsFull }        from "./ResultsFull";
import { parseCrawsecureJson, runBrowserScan } from "@/lib/scanner";
import type { ScanResult } from "@/types/scanner";

type State =
  | { status: "idle" }
  | { status: "scanning" }
  | { status: "done"; result: ScanResult }
  | { status: "error"; message: string };

function isCrawsecureJson(files: FileList): boolean {
  return files.length === 1 && files[0].name === "crawsecure.json";
}

export function ScanOrchestrator() {
  const { data: session } = useSession();
  const [state, setState] = useState<State>({ status: "idle" });

  const handleFiles = useCallback(async (files: FileList) => {
    setState({ status: "scanning" });

    try {
      let result: ScanResult;

      if (isCrawsecureJson(files)) {
        const text = await files[0].text();
        result = parseCrawsecureJson(text);
      } else {
        result = await runBrowserScan(files);
      }

      setState({ status: "done", result });
    } catch (err) {
      setState({
        status:  "error",
        message: err instanceof Error ? err.message : "Failed to process files.",
      });
    }
  }, []);

  const reset = useCallback(() => setState({ status: "idle" }), []);

  // ── Idle ──────────────────────────────────────────────────────────────────
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

  // ── Scanning ──────────────────────────────────────────────────────────────
  if (state.status === "scanning") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-muted-foreground">
        <div className="h-8 w-8 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-sm">Scanning locally — nothing is uploaded…</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm text-destructive">{state.message}</p>
        <Button variant="outline" size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  const { result } = state;
  const isPro      = session?.user.plan === "pro";

  return (
    <div className="flex flex-col items-center gap-4">
      {session ? (
        <ResultsFull result={result} isPro={isPro} />
      ) : (
        <ResultsAnonymous result={result} />
      )}

      <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
        ← Scan another skill
      </Button>
    </div>
  );
}
