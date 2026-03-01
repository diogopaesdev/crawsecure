"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScanTypeSelector, type ScanType } from "./ScanTypeSelector";
import { ScanOrchestrator } from "./ScanOrchestrator";

export function AnalyzeShell() {
  const [scanType, setScanType] = useState<ScanType>("skill");

  return (
    <div className="flex flex-col items-center gap-8 py-8">

      {/* Header */}
      <div className="text-center max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">Security Scanner</h1>
        <p className="text-muted-foreground text-sm">
          Choose what you want to analyse. All scans run locally — your files never leave this device.
        </p>
      </div>

      {/* Type selector */}
      <ScanTypeSelector selected={scanType} onChange={setScanType} />

      {/* Trust pill */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-4 py-2 rounded-full border">
        <span className="text-green-500">●</span>
        <span>Your files never leave this device</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">Offline</Badge>
      </div>

      {/* Active scanner */}
      {scanType === "skill" && <ScanOrchestrator />}

    </div>
  );
}
