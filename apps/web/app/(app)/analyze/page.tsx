import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ScanOrchestrator } from "@/components/scanner/ScanOrchestrator";

export const metadata: Metadata = {
  title:       "Analyze",
  description: "Scan a ClawHub skill locally. Your code never leaves your machine.",
};

export default function AnalyzePage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">

      {/* Header */}
      <div className="text-center max-w-xl">
        <h1 className="text-2xl font-semibold mb-2">Skill Security Scanner</h1>
        <p className="text-muted-foreground text-sm">
          Drop a{" "}
          <code className="bg-muted px-1 rounded text-xs">crawsecure.json</code>
          {" "}from the CLI, or upload your skill files directly.
          Analysis runs entirely in your browser.
        </p>
      </div>

      {/* Trust pill */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 px-4 py-2 rounded-full border">
        <span className="text-green-500">●</span>
        <span>Your files never leave this device</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">Offline</Badge>
      </div>

      {/* Scanner — client component */}
      <ScanOrchestrator />

    </div>
  );
}
