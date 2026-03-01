import Link from "next/link";
import {
  ShieldCheck, ScanLine, Eye, BarChart2, FileJson, Search, Github,
  Terminal, ChevronRight, Lock, Zap,
} from "lucide-react";
import { Button }  from "@/components/ui/button";
import { Badge }   from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslations } from "next-intl/server";

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

  CrawSecure v2 — Privacy-first skill scanner

  Scanning ./my-skill …

  ⚠  MEDIUM  child-process  Executes system commands
  🔴 HIGH    eval           Dynamic code execution via eval()
  ⚠  MEDIUM  curl           Network request via curl

  ─────────────────────────────────────
  Files scanned : 12
  Score         : 72  ›  HIGH
  ─────────────────────────────────────

  Visualize at → crawsecure.dev/analyze`;

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const t = await getTranslations("home");

  const features = [
    { icon: ShieldCheck, title: t("feat1Title"), description: t("feat1Desc") },
    { icon: Eye,         title: t("feat2Title"), description: t("feat2Desc") },
    { icon: BarChart2,   title: t("feat3Title"), description: t("feat3Desc") },
    { icon: FileJson,    title: t("feat4Title"), description: t("feat4Desc") },
    { icon: Search,      title: t("feat5Title"), description: t("feat5Desc") },
    { icon: Github,      title: t("feat6Title"), description: t("feat6Desc") },
  ];

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

  const pills = [
    { icon: Lock,        text: t("pill1") },
    { icon: Eye,         text: t("pill2") },
    { icon: ShieldCheck, text: t("pill3") },
    { icon: Zap,         text: t("pill4") },
  ];

  const legend = [
    { color: "bg-red-500",   label: t("rulesHigh") },
    { color: "bg-amber-500", label: t("rulesMedium") },
    { color: "bg-blue-500",  label: t("rulesLow") },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-4 sm:px-6 pt-28 pb-20 gap-7 overflow-hidden">
        {/* Gradient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, oklch(0.52 0.24 285 / 0.12), transparent)",
          }}
        />

        <Badge
          variant="secondary"
          className="gap-1.5 border border-border/60 bg-background px-3 py-1 text-xs font-medium shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
          {t("badge")}
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05]">
          {t("heroTitle1")}{" "}
          <span
            style={{
              background: "linear-gradient(135deg, oklch(0.52 0.24 285), oklch(0.65 0.20 310))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("heroTitle2")}
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <Button asChild size="lg" className="gap-2 shadow-sm">
            <Link href="/analyze">
              <ScanLine className="h-4 w-4" />
              {t("ctaPrimary")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a href="https://github.com/diogopaesdev/crawsecure" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              {t("ctaGitHub")}
            </a>
          </Button>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {pills.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 border border-border/50 rounded-full px-3 py-1"
            >
              <Icon className="h-3 w-3 text-primary" />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ── CLI demo ─────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-border/60 bg-zinc-950 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/60">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
              <div className="ml-auto flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <Terminal className="h-3 w-3" />
                Terminal
              </div>
            </div>
            <pre className="p-6 text-[13px] font-mono text-zinc-300 whitespace-pre overflow-x-auto leading-[1.8]">
              {CLI_DEMO}
            </pre>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{t("howTitle")}</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {t("howSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col gap-4">
                <span className="text-[48px] font-mono font-bold leading-none text-primary/20 dark:text-primary/15 tabular-nums">
                  {step}
                </span>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{t("featTitle")}</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {t("featSubtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/60 bg-card hover:border-primary/30 transition-colors">
                <CardContent className="pt-5 flex flex-col gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rules showcase ───────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">{t("rulesTitle")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("rulesSubtitle")}{" "}
              <a
                href="https://github.com/diogopaesdev/crawsecure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                {t("rulesSource")}
              </a>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {rules.map(({ id, level, label }) => (
              <div
                key={id}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3.5 py-2.5 hover:border-primary/30 transition-colors"
              >
                <span className={`h-2 w-2 rounded-full shrink-0 ${LEVEL_DOT[level]}`} />
                <span className={`font-mono text-xs font-semibold shrink-0 ${LEVEL_TEXT[level]}`}>
                  {id}
                </span>
                <span className="text-xs text-muted-foreground truncate">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-5 mt-6 justify-center text-xs text-muted-foreground">
            {legend.map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy strip ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16 border-t border-border/50">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-5">
          <div
            className="inline-flex h-12 w-12 mx-auto items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.52 0.24 285), oklch(0.65 0.20 310))",
            }}
          >
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t("privTitle")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("privBody")}
          </p>
          <Button asChild variant="outline" size="sm" className="mx-auto gap-1.5">
            <Link href="/trust">
              {t("privBtn")}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20 border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            {t("faqTitle")}
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-24 border-t border-border/50">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-5 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{t("ctaTitle")}</h2>
          <p className="text-muted-foreground text-sm">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2 shadow-sm">
              <Link href="/analyze">
                <ScanLine className="h-4 w-4" />
                {t("ctaOpen")}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">{t("ctaPlans")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 px-4 sm:px-6 py-6">
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
