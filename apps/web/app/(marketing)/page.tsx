import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: "🖥️",
    title: "100% Local Analysis",
    description:
      "All scans run in your browser or CLI. Your code is never uploaded, stored, or transmitted.",
  },
  {
    icon: "🔒",
    title: "Read-Only Engine",
    description:
      "CrawSecure never executes code. It reads, inspects, and reports — nothing more.",
  },
  {
    icon: "📊",
    title: "Risk Scoring",
    description:
      "Every scan produces a scored report: SAFE, MEDIUM, or HIGH — with per-rule breakdowns.",
  },
  {
    icon: "📂",
    title: "JSON Export",
    description:
      "Generate a crawsecure.json with the CLI and load it into the web UI for visualization.",
  },
  {
    icon: "🔍",
    title: "Static Analysis",
    description:
      "Detects dangerous commands, process spawning, file deletion, network access, and sensitive file references.",
  },
  {
    icon: "🌐",
    title: "Open Source Engine",
    description:
      "The scan rules are public. Audit exactly what we look for — no black boxes.",
  },
];

const steps = [
  {
    step: "01",
    title: "Scan locally",
    description: "Run the CLI on any skill directory, or load a crawsecure.json in your browser.",
  },
  {
    step: "02",
    title: "Analysis runs on your machine",
    description:
      "The engine reads file contents locally and applies security rules. Nothing leaves your device.",
  },
  {
    step: "03",
    title: "Get your security report",
    description:
      "See which rules were triggered, severity levels, and an overall risk score — instantly.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-24 pb-16 gap-6">
        <Badge variant="secondary" className="text-xs">Privacy-first · Offline · Open source</Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Scan skills.{" "}
          <span className="text-violet-600">Keep your code.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl">
          CrawSecure analyzes ClawHub skills for dangerous patterns before you install them.
          Analysis runs entirely on your machine — your files never leave.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button asChild size="lg">
            <Link href="/analyze">Start scanning — it&apos;s free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://github.com/crawsecure/crawsecure"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-muted-foreground">
          {["Your code never leaves your machine", "No uploads", "Read-only engine", "Exit code 2 for CI/CD"].map(
            (badge) => (
              <span key={badge} className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> {badge}
              </span>
            )
          )}
        </div>
      </section>

      {/* How it works */}
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

      {/* Features */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">
            What CrawSecure detects
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon, title, description }) => (
              <Card key={title} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{icon}</span> {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-xl mx-auto flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Ready to scan?</h2>
          <p className="text-muted-foreground text-sm">
            No account required. Sign in only when you want to save your history.
          </p>
          <Button asChild size="lg" className="mx-auto">
            <Link href="/analyze">Open the scanner</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 CrawSecure. MIT License.</span>
          <div className="flex gap-4 justify-center">
            <Link href="/trust" className="hover:text-foreground transition-colors">Trust & Privacy</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <a href="https://github.com/crawsecure/crawsecure" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
