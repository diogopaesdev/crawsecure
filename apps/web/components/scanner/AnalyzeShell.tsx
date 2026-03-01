"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ScanTypeSelector, type ScanType } from "./ScanTypeSelector";
import { ScanOrchestrator } from "./ScanOrchestrator";

export function AnalyzeShell() {
  const [scanType, setScanType] = useState<ScanType>("skill");
  const t = useTranslations("analyze");
  const tc = useTranslations("common");

  return (
    <div className="flex flex-col items-center gap-8 py-8">

      {/* Header */}
      <div className="text-center max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>

      {/* Type selector */}
      <ScanTypeSelector selected={scanType} onChange={setScanType} />

      {/* Trust pill */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-4 py-2 rounded-full border">
        <span className="text-green-500">●</span>
        <span>{t("trustPill")}</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{tc("offline")}</Badge>
      </div>

      {/* Active scanner */}
      {scanType === "skill" && <ScanOrchestrator />}

    </div>
  );
}
