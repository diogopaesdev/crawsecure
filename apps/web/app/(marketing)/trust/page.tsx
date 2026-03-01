import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Trust & Privacy",
  description: "How CrawSecure keeps your code private and your data safe.",
};

const guarantees = [
  {
    icon: "✅",
    title: "Your code never leaves your machine",
    body: "All analysis runs locally — in the CLI or in your browser. File contents are processed in memory and discarded immediately after the scan. No uploads, no exceptions.",
  },
  {
    icon: "✅",
    title: "Only security signals are stored",
    body: "When you choose to save a scan (authenticated users), we store only: overall score, rule names triggered, file count, and severity counts. Never file paths, never code snippets.",
  },
  {
    icon: "✅",
    title: "Scans are read-only",
    body: "The engine never writes to disk, never executes code from scanned files, and never modifies your system in any way.",
  },
  {
    icon: "✅",
    title: "Open source engine",
    body: "The scanner rules are public on GitHub. You can audit exactly what patterns we detect. No black boxes, no hidden logic.",
  },
  {
    icon: "✅",
    title: "No dark patterns",
    body: "We do not force uploads. We do not run hidden network calls during analysis. Saving a scan is always opt-in. You are always in control.",
  },
  {
    icon: "✅",
    title: "Verifiable in your browser",
    body: "Open DevTools → Network tab while running a scan. You will see zero outbound calls during analysis. The scan payload (if you choose to save) is shown to you before submission.",
  },
];

const thirdParties = [
  {
    name: "GitHub OAuth",
    purpose: "Authentication only",
    data: "GitHub username, public profile, email (optional)",
    stored: "Username + email stored in Firestore user document",
    link: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps",
  },
  {
    name: "Firebase Firestore",
    purpose: "Scan history & user data",
    data: "Aggregated scan signals, usage counts, user profile",
    stored: "No file paths, no code. Only numbers and rule IDs.",
    link: "https://firebase.google.com/support/privacy",
  },
  {
    name: "Stripe",
    purpose: "Payment processing (PRO plan)",
    data: "Name, email, payment method (handled entirely by Stripe)",
    stored: "CrawSecure stores only the Stripe customer ID and subscription status",
    link: "https://stripe.com/privacy",
  },
];

export default function TrustPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-16">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-3">Trust & Privacy</h1>
        <p className="text-muted-foreground">
          Security tools need to be trustworthy. Here is exactly how CrawSecure handles your data.
        </p>
      </div>

      {/* ── Data flow diagram ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Data flow — what goes where</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* CLI path */}
          <div className="rounded-lg border bg-muted/30 p-4 flex flex-col gap-3 text-sm">
            <p className="font-medium flex items-center gap-2">
              <span className="text-green-500">●</span> CLI path (100% local)
            </p>
            <pre className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre">{`your machine
  └─ npx crawsecure .
       └─ reads files → memory
       └─ applies rules
       └─ prints report
       └─ [optional] --output
            └─ crawsecure.json
               └─ stays on disk
                  (you control it)`}</pre>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Zero network calls
            </p>
          </div>

          {/* Web path */}
          <div className="rounded-lg border bg-muted/30 p-4 flex flex-col gap-3 text-sm">
            <p className="font-medium flex items-center gap-2">
              <span className="text-blue-500">●</span> Web scanner path
            </p>
            <pre className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre">{`browser
  └─ File API → memory
  └─ @crawsecure/browser
       └─ applies rules
       └─ result shown in UI
       └─ [opt-in] Save scan
            └─ POST /api/scans
               └─ score: 72
               └─ risk: "HIGH"
               └─ rules: [...]
               └─ filesScanned: 12
               (no code, no paths)`}</pre>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              ✓ File contents never leave the tab
            </p>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Guarantees ────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Privacy guarantees</h2>
        <div className="flex flex-col gap-3">
          {guarantees.map(({ icon, title, body }) => (
            <Card key={title} className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{icon}</span> {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── What we store ─────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Exact data stored when you save a scan</h2>
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground flex flex-col gap-3">
          <pre className="text-xs overflow-x-auto font-mono">{`{
  "scanId":       "550e8400-e29b-41d4-a716-446655440000",
  "userId":       "github|12345678",
  "summary":      { "critical": 2, "warning": 5, "info": 1 },
  "score":        68,
  "risk":         "HIGH",
  "rulesTriggered": ["eval", "curl"],
  "filesScanned": 42,
  "createdAt":    "2026-03-01T12:00:00Z"
}`}</pre>
          <div className="flex flex-col gap-1 text-xs">
            <p className="font-medium text-foreground">Nothing else. Specifically, we never store:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>File names or paths</li>
              <li>File contents or code snippets</li>
              <li>Directory structure</li>
              <li>Your Git history or repository metadata</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          The server validates every save request with a strict Zod schema that only accepts the
          fields above.{" "}
          <a
            href="https://github.com/crawsecure/crawsecure"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Read the source →
          </a>
        </p>
      </section>

      <Separator />

      {/* ── Third-party services ──────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Third-party services we use</h2>
        <p className="text-sm text-muted-foreground">
          CrawSecure uses three external services. Here is exactly what each one receives.
        </p>
        <div className="flex flex-col gap-3">
          {thirdParties.map(({ name, purpose, data, stored, link }) => (
            <div key={name} className="rounded-lg border px-4 py-3 flex flex-col gap-1.5 text-sm">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-medium">{name}</p>
                <span className="text-xs text-muted-foreground">{purpose}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Receives: </span>{data}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">We store: </span>{stored}
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-600 hover:underline self-start"
              >
                Privacy policy →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer note ───────────────────────────────────────────────── */}
      <div className="text-center text-sm text-muted-foreground">
        Questions?{" "}
        <a
          href="https://github.com/crawsecure/crawsecure/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:underline"
        >
          Open a GitHub issue
        </a>{" "}
        and we&apos;ll answer publicly.
      </div>

    </div>
  );
}
