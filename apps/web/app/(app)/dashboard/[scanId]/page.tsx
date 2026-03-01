import type { Metadata } from "next";

export const metadata: Metadata = { title: "Scan Detail" };

// Scan detail will be populated from Firestore in Step 4.

export default function ScanDetailPage({ params }: { params: { scanId: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Scan Detail</h1>
      <p className="text-muted-foreground text-sm">
        Scan ID: <code className="bg-muted px-1 rounded text-xs">{params.scanId}</code>
      </p>
      <p className="text-muted-foreground text-sm">Full detail view coming in Step 4.</p>
    </div>
  );
}
