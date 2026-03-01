"use client";

import { Button } from "@/components/ui/button";
import type { StoredScan } from "@/lib/scans";

interface Props {
  scan: StoredScan;
}

export function ExportReportButton({ scan }: Props) {
  function handleExport() {
    const report = {
      generated: new Date().toISOString(),
      privacy:   "No file paths or source code — aggregated security signals only.",
      id:        scan.id,
      score:     scan.score,
      risk:      scan.risk,
      summary:   scan.summary,
      rulesTriggered: scan.rulesTriggered,
      filesScanned:   scan.filesScanned,
      createdAt:      scan.createdAt,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `crawsecure-${scan.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      ↓ Export JSON
    </Button>
  );
}
