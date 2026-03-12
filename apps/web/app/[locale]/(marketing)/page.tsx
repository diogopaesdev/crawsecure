import { Link } from "@/i18n/navigation";
import {
  ShieldCheck, Terminal, ChevronRight, Lock, ArrowRight, ScanLine,
} from "lucide-react";
import { Button }  from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations } from "next-intl/server";
import { getTotalScans } from "@/lib/stats";
import { HeroRotator } from "@/components/landing/HeroRotator";

// ── Constants ────────────────────────────────────────────────────────────────

const LEVEL_DOT: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-amber-500",
  low:    "bg-blue-500",
};

const LEVEL_TEXT: Record<string, string> = {
  high:   "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low:    "text-blue-600 dark:text-blue-400",
};

const CLI_DEMO = `$ npx crawsecure ./my-skill

┌──────────────────────────────────────────────────┐
│  CrawSecure v2  ·  @username  [FREE]             │
└──────────────────────────────────────────────────┘

Target: ./my-skill

🚨 Security signals found: 3

  🔴 [HIGH]   Detected eval() usage — src/index.js
  🟡 [MEDIUM] child_process detected — src/utils.js
  🟢 [LOW]    process.env access — src/config.js

📊 Risk score: 8500 → HIGH

  Scan saved  →  crawsecure.com/dashboard/abc123
  Free · 3 / 10 scans this month`;

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const t = await getTranslations("home");
  const totalScans = await getTotalScans();

  const steps = [
    { step: "01", title: t("step1Title"), description: t("step1Desc") },
    { step: "02", title: t("step2Title"), description: t("step2Desc") },
    { step: "03", title: t("step3Title"), description: t("step3Desc") },
  ];

  const rules: { id: string; level: "high" | "medium" | "low"; label: string }[] = [
    { id: "rm-rf",         level: "high",   label: t("ruleRmRf") },
    { id: "eval",          level: "high",   label: t("ruleEval") },
    { id: "exec",          level: "high",   label: t("ruleExec") },
    { id: "ssh-dir",       level: "high",   label: t("ruleSshDir") },
    { id: "id-rsa",        level: "high",   label: t("ruleIdRsa") },
    { id: "child-process", level: "medium", label: t("ruleChildProcess") },
    { id: "spawn",         level: "medium", label: t("ruleSpawn") },
    { id: "curl",          level: "medium", label: t("ruleCurl") },
    { id: "wget",          level: "medium", label: t("ruleWget") },
    { id: "dotenv",        level: "medium", label: t("ruleDotenv") },
    { id: "wallet",        level: "medium", label: t("ruleWallet") },
    { id: "credentials",   level: "medium", label: t("ruleCredentials") },
    { id: "process-env",   level: "low",    label: t("ruleProcessEnv") },
  ];

  const faqs = [
    { q: t("faq1q"), a: t("faq1a") },
    { q: t("faq2q"), a: t("faq2a") },
    { q: t("faq3q"), a: t("faq3a") },
    { q: t("faq4q"), a: t("faq4a") },
    { q: t("faq5q"), a: t("faq5a") },
    { q: t("faq6q"), a: t("faq6a") },
  ];

  const privPoints = [
    t("privPoint1"),
    t("privPoint2"),
    t("privPoint3"),
    t("privPoint4"),
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroRotator />

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <div className="border-y border-border/60 bg-muted/20">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-border/60">
          <div className="flex flex-col items-center py-5 px-4 gap-0.5">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
              {totalScans > 0 ? totalScans.toLocaleString() : "—"}
            </span>
            <span className="text-xs text-muted-foreground">{t("statScansLabel")}</span>
          </div>
          <div className="flex flex-col items-center py-5 px-4 gap-0.5">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">13</span>
            <span className="text-xs text-muted-foreground">{t("statRulesLabel")}</span>
          </div>
          <div className="flex flex-col items-center py-5 px-4 gap-0.5">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight font-mono text-lg sm:text-xl">.js .ts .sh</span>
            <span className="text-xs text-muted-foreground">{t("statFilesLabel")}</span>
          </div>
        </div>
      </div>

      {/* ── CLI demo ─────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/80">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <Terminal className="h-3 w-3" />
                bash
              </div>
            </div>
            <pre className="p-5 sm:p-7 text-[11px] sm:text-[13px] font-mono text-zinc-300 whitespace-pre overflow-x-auto leading-[1.9]">
              {CLI_DEMO}
            </pre>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("howTitle")}</h2>
            <p className="text-muted-foreground text-sm mt-2">{t("howSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col gap-4">
                <span className="text-5xl font-mono font-bold leading-none text-border tabular-nums select-none">
                  {step}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rules ────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("rulesTitle")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("rulesSubtitle")}</p>
            </div>
            <a
              href="https://github.com/diogopaesdev/crawsecure"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline underline-offset-4 shrink-0"
            >
              {t("rulesSource")} ↗
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {rules.map(({ id, level, label }) => (
              <div
                key={id}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-3.5 py-2.5 hover:bg-card transition-colors"
              >
                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${LEVEL_DOT[level]}`} />
                <span className={`font-mono text-[11px] font-semibold shrink-0 ${LEVEL_TEXT[level]}`}>
                  {id}
                </span>
                <span className="text-xs text-muted-foreground truncate">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-5 mt-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />{t("rulesHigh")}</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{t("rulesMedium")}</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" />{t("rulesLow")}</span>
          </div>
        </div>
      </section>

      {/* ── Privacy ──────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-border/50">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-10 sm:gap-16 items-start">
          <div className="flex flex-col gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted">
              <Lock className="h-4 w-4 text-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
              {t("privTitle")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privBody")}
            </p>
            <Button asChild variant="outline" size="sm" className="gap-1.5 self-start mt-1">
              <Link href="/trust">
                {t("privBtn")}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <ul className="flex flex-col gap-3 pt-1">
            {privPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 h-4 w-4 rounded-full border border-border flex items-center justify-center shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-muted-foreground leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10">
            {t("faqTitle")}
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-border/50">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("ctaTitle")}</h2>
            <p className="text-muted-foreground text-sm mt-2">{t("ctaSubtitle")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button asChild size="lg" className="gap-2">
              <Link href="/analyze">
                {t("ctaOpen")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">{t("ctaPlans")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 px-4 sm:px-6 py-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-3 w-3" />
            </div>
            <span>CrawSecure · MIT License · © 2026</span>
          </div>
          <div className="flex gap-5 text-sm text-muted-foreground">
            <Link href="/trust"   className="hover:text-foreground transition-colors">{t("footerTrust")}</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">{t("footerPricing")}</Link>
            <a
              href="https://github.com/diogopaesdev/crawsecure"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
