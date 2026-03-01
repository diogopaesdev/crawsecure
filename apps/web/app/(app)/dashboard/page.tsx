import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard",
};

// Scan history will be populated from Firestore in Step 4.

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Scans</h1>
        <Badge variant={session.user.plan === "pro" ? "default" : "secondary"}>
          {session.user.plan === "pro" ? "PRO" : "Free — 10 scans/mo"}
        </Badge>
      </div>

      {/* Empty state */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground font-normal text-center py-8">
            No scans yet. Run a scan in{" "}
            <a href="/analyze" className="text-violet-600 underline underline-offset-2">
              /analyze
            </a>{" "}
            to see history here.
          </CardTitle>
        </CardHeader>
        <CardContent />
      </Card>

      {/* Scan history list — populated in Step 4 */}
    </div>
  );
}
