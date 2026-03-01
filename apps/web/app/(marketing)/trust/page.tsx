import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    body: "We do not force uploads. We do not run hidden network calls during analysis. The --sync flag is always opt-in. You are always in control.",
  },
  {
    icon: "✅",
    title: "Verifiable in your browser",
    body: "Open DevTools → Network tab while running a scan. You will see zero outbound calls during analysis. The scan payload (if you choose to save) is shown to you before submission.",
  },
];

export default function TrustPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">Trust & Privacy</h1>
        <p className="text-muted-foreground">
          Security tools need to be trustworthy. Here is exactly how CrawSecure handles your data.
        </p>
      </div>

      <div className="flex flex-col gap-4">
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

      <div className="mt-12 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">What we store when you save a scan</p>
        <pre className="text-xs overflow-x-auto">{`{
  "scanId": "uuid",
  "userId": "uid",
  "summary": { "critical": 2, "warning": 5, "info": 1 },
  "score": 68,
  "rulesTriggered": ["eval", "curl"],
  "createdAt": "ISO_DATE"
}`}</pre>
        <p className="mt-2">Nothing else. No file contents. No paths. No code.</p>
      </div>
    </div>
  );
}
