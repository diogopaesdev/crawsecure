import type { Metadata } from "next";
import { AnalyzeShell } from "@/components/scanner/AnalyzeShell";

export const metadata: Metadata = {
  title:       "Analyze",
  description: "Scan a ClawHub skill locally. Your code never leaves your machine.",
};

export default function AnalyzePage() {
  return <AnalyzeShell />;
}
