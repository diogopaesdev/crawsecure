import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AnalyzeShell } from "@/components/scanner/AnalyzeShell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("analyze");
  return { title: t("title"), description: t("description") };
}

export default function AnalyzePage() {
  return <AnalyzeShell />;
}
