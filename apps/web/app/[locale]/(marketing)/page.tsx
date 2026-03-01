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

// ── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: ShieldCheck,
    title: "100% Local Analysis",
    description: "All scans run in your browser or CLI. Your code is never uploaded, stored, or transmitted.",
  },
  {
    icon: Eye,
    title: "Read-Only Engine",
    description: "CrawSecure never executes code. It reads, inspects, and reports — nothing more.",
  },
  {
    icon: BarChart2,
    title: "Risk Scoring",
    description: "Every scan produces a scored report: SAFE, MEDIUM, or HIGH — with per-rule breakdowns.",
  },
  {
    icon: FileJson,
    title: "JSON Export",
    description: "Generate a crawsecure.json with the CLI and load it into the web UI for visualization.",
  },
  {
    icon: Search,
    title: "Static Analysis",
    description: "Detects dangerous commands, process spawning, file deletion, network access, and sensitive file references.",
  },
  {
    icon: Github,
    title: "Open Source Engine",
    description: "The scan rules are public. Audit exactly what we look for — no black boxes.",
  },
];

const steps = [
  {
    step: "01",
    title: "Drop files or run the CLI",
    description: "Drag project files into the browser scanner, or run `npx crawsecure .` from any directory.",
  },
  {
    step: "02",
    title: "Analysis runs locally",
    description: "The engine reads file contents in memory and applies 13 security rules. Nothing leaves your device.",
  },
  {
    step: "03",
    title: "Get your security report",
    description: "See which rules fired, severity levels, and an overall risk score — instantly.",
  },
];

const rules: { id: string; level: "high" | "medium" | "low"; label: string }[] = [
  { id: "rm-rf",        level: "high",   label: "Destructive rm -rf command" },
  { id: "eval",         level: "high",   label: "Dynamic code execution via eval()" },
  { id: "exec",         level: "high",   label: "Process execution via exec()" },
  { id: "ssh-dir",      level: "high",   label: "References .ssh directory" },
  { id: "id-rsa",       level: "high",   label: "References SSH private key" },
  { id: "child-process",level: "medium", label: "Executes system commands" },
  { id: "spawn",        level: "medium", label: "Child process via spawn()" },
  { id: "curl",         level: "medium", label: "Network request via curl" },
  { id: "wget",         level: "medium", label: "File download via wget" },
  { id: "dotenv",       level: "medium", label: "References .env file (secrets)" },
  { id: "wallet",       level: "medium", label: "References wallet file" },
  { id: "credentials",  level: "medium", label: "References credentials file" },
  { id: "process-env",  level: "low",    label: "Access to environment variables" },
];

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

const faqs = [
  {
    q: "Does CrawSecure upload my code?",
    a: "Never. All analysis runs in your browser or CLI on your machine. File contents are processed in memory and discarded immediately. The server only ever receives aggregated numbers — score, rule IDs, file count.",
  },
  {
    q: "What does the server actually store if I save a scan?",
    a: "Only: overall risk score, the list of rule IDs that fired, total file count, and severity counts. No file names, no file paths, no code snippets. You can verify this by reading the open-source POST /api/scans handler.",
  },
  {
    q: "Can I use CrawSecure in CI/CD?",
    a: "Yes. Run `npx crawsecure .` in any pipeline step. The CLI exits with code 0 for SAFE, code 2 for HIGH risk — which most CI systems treat as a failure.",
  },
  {
    q: "What file types does CrawSecure scan?",
    a: "JavaScript (.js, .mjs, .cjs), TypeScript (.ts, .tsx), Shell scripts (.sh, .bash), JSON config files, and YAML. Binary files and node_modules are automatically excluded.",
  },
  {
    q: "Is the engine open source?",
    a: "Yes. The core scanner (packages/core) and all 13 rule patterns are public on GitHub. You can audit exactly what we look for before trusting the tool.",
  },
  {
    q: "What's the difference between Free and PRO?",
    a: "Free users get 10 scans per month and see the last 5 scans in their dashboard. PRO removes all limits, shows the full history, adds the score trend chart, and enables JSON export.",
  },
];

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

export default function LandingPage() {
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
          Privacy-first · Offline · Open source
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05]">
          Scan skills.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, oklch(0.52 0.24 285), oklch(0.65 0.20 310))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Keep your code.
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
          CrawSecure analyzes ClawHub skills for dangerous patterns before you install them.
          Analysis runs entirely on your machine — your files never leave.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <Button asChild size="lg" className="gap-2 shadow-sm">
            <Link href="/analyze">
              <ScanLine className="h-4 w-4" />
              Start scanning — it&apos;s free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a href="https://github.com/diogopaesdev/crawsecure" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {[
            { icon: Lock,  text: "Code never leaves your machine" },
            { icon: Eye,   text: "No uploads" },
            { icon: ShieldCheck, text: "Read-only engine" },
            { icon: Zap,   text: "Exit code 2 for CI/CD" },
          ].map(({ icon: Icon, text }) => (
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
            <h2 className="text-3xl font-bold tracking-tight mb-3">How it works</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Three steps, zero uploads, instant results.
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
            <h2 className="text-3xl font-bold tracking-tight mb-3">Built for trust</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Every design decision prioritises your privacy and security.
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
            <h2 className="text-3xl font-bold tracking-tight mb-3">What we detect</h2>
            <p className="text-sm text-muted-foreground">
              13 stable rule IDs — all public, all auditable.{" "}
              <a
                href="https://github.com/diogopaesdev/crawsecure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                See source
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
            {[
              { color: "bg-red-500",   label: "High risk" },
              { color: "bg-amber-500", label: "Medium risk" },
              { color: "bg-blue-500",  label: "Low risk" },
            ].map(({ color, label }) => (
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
            Your code never touches our servers. Ever.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Open DevTools → Network tab while running a scan. You will see zero outbound requests
            during analysis. If you choose to save a scan, you&apos;ll see exactly what is sent —
            a handful of numbers, nothing more.
          </p>
          <Button asChild variant="outline" size="sm" className="mx-auto gap-1.5">
            <Link href="/trust">
              Read our privacy commitment
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-20 border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Frequently asked questions
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
          <h2 className="text-3xl font-bold tracking-tight">Ready to scan?</h2>
          <p className="text-muted-foreground text-sm">
            No account required. Sign in only when you want to save your history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2 shadow-sm">
              <Link href="/analyze">
                <ScanLine className="h-4 w-4" />
                Open the scanner
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See plans</Link>
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
            <Link href="/trust"   className="hover:text-foreground transition-colors">Trust & Privacy</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
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
