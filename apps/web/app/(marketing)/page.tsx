import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge }  from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ── Data ────────────────────────────────────────────────────────────────────

const trustBadges = [
  "Code never leaves your machine",
  "No uploads",
  "Read-only engine",
  "Exit code 2 for CI/CD",
];

const steps = [
  {
    step: "01",
    title: "Drop files or run the CLI",
    description:
      "Drag project files into the browser scanner, or run `npx crawsecure .` from any directory.",
  },
  {
    step: "02",
    title: "Analysis runs locally",
    description:
      "The engine reads file contents in memory and applies 13 security rules. Nothing ever leaves your device.",
  },
  {
    step: "03",
    title: "Get your security report",
    description:
      "See which rules fired, their severity, and an overall risk score — instantly. Save history or export JSON.",
  },
];

// All 13 stable rule IDs — keep in sync with packages/core/src/rules.js
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

const LEVEL_COLOR: Record<string, string> = {
  high:   "text-red-600   dark:text-red-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  low:    "text-blue-600  dark:text-blue-400",
};

const LEVEL_DOT: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-yellow-500",
  low:    "bg-blue-500",
};

const faqs = [
  {
    q: "Does CrawSecure upload my code?",
    a: "Never. All analysis runs in your browser (via WebAssembly-compatible JS) or in the Node.js CLI on your machine. File contents are processed in memory and discarded immediately. The server only ever receives aggregated numbers — score, rule IDs, file count.",
  },
  {
    q: "What does the server actually store if I save a scan?",
    a: "Only: overall risk score, the list of rule IDs that fired, total file count, and severity counts (critical / warning / info). No file names, no file paths, no code snippets. You can verify this by reading the open-source POST /api/scans handler.",
  },
  {
    q: "Can I use CrawSecure in CI/CD?",
    a: "Yes. Run `npx crawsecure .` in any pipeline step. The CLI exits with code 0 for SAFE, code 2 for HIGH risk — which most CI systems treat as a failure. PRO users can also generate an `--output crawsecure.json` artifact.",
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
    a: "Free users get 10 scans per month and see the last 5 scans in their dashboard. PRO removes all limits, shows the full scan history (up to 50), adds the score trend chart, and enables JSON export from the dashboard.",
  },
];

// ── CLI demo ─────────────────────────────────────────────────────────────────

const CLI_DEMO = `$ npx crawsecure ./my-skill

  CrawSecure v2.0.0 — Privacy-first skill scanner

  Scanning ./my-skill …

  ⚠  MEDIUM  child-process  Executes system commands        (cli.js:14)
  🔴 HIGH    eval           Dynamic code execution via eval() (utils.js:8)
  ⚠  MEDIUM  curl           Network request via curl         (setup.sh:3)

  ─────────────────────────────────────────
  Files scanned : 12
  Score         : 72  (HIGH)
  Findings      : 3
  ─────────────────────────────────────────

  🌐 Visualize at → https://crawsecure.dev/analyze`;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-4 pt-24 pb-16 gap-6">
        <Badge variant="secondary" className="text-xs">
          Privacy-first · Offline · Open source
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Scan skills.{" "}
          <span className="text-violet-600 dark:text-violet-400">Keep your code.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl">
          CrawSecure analyzes ClawHub skills for dangerous patterns before you install them.
          All analysis runs entirely on your machine — your files never leave.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button asChild size="lg">
            <Link href="/analyze">Start scanning — it&apos;s free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://github.com/diogopaesdev/crawsecure"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-muted-foreground">
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ── CLI demo ─────────────────────────────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border bg-zinc-950 dark:bg-zinc-900 shadow-xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800">
              <span className="h-3 w-3 rounded-full bg-red-500/70" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <span className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-zinc-500 font-mono">Terminal</span>
            </div>
            <pre className="p-5 text-xs sm:text-sm font-mono text-zinc-300 whitespace-pre overflow-x-auto leading-relaxed">
              {CLI_DEMO}
            </pre>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="text-4xl font-mono font-bold text-violet-200 dark:text-violet-900">
                  {step}
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rules showcase ───────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold mb-2">What CrawSecure detects</h2>
            <p className="text-sm text-muted-foreground">
              13 stable rule IDs — all public, all auditable.{" "}
              <a
                href="https://github.com/diogopaesdev/crawsecure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 hover:underline"
              >
                See source →
              </a>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {rules.map(({ id, level, label }) => (
              <div
                key={id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm bg-background"
              >
                <span className={`h-2 w-2 rounded-full shrink-0 ${LEVEL_DOT[level]}`} />
                <span className={`font-mono text-xs font-semibold shrink-0 ${LEVEL_COLOR[level]}`}>
                  {id}
                </span>
                <span className="text-muted-foreground truncate">{label}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-5 justify-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> High risk</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Medium risk</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Low risk</span>
          </div>
        </div>
      </section>

      {/* ── Privacy guarantee strip ───────────────────────────────────────── */}
      <section className="px-4 py-12 bg-violet-600 dark:bg-violet-900 text-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            Your code never touches our servers. Ever.
          </h2>
          <p className="text-violet-100 text-sm max-w-2xl mx-auto">
            Open DevTools → Network tab while running a scan. You will see zero outbound requests
            during analysis. If you choose to save a scan, you&apos;ll see exactly what is sent —
            a handful of numbers, nothing more.
          </p>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="mx-auto bg-white text-violet-700 hover:bg-violet-50"
          >
            <Link href="/trust">Read our privacy commitment →</Link>
          </Button>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="flex flex-col gap-0">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 text-center bg-muted/40">
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Ready to scan?</h2>
          <p className="text-muted-foreground text-sm">
            No account required. Sign in only when you want to save your history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/analyze">Open the scanner</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 CrawSecure. MIT License.</span>
          <div className="flex gap-4 justify-center">
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
