import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <Badge
            variant={session.user.plan === "pro" ? "default" : "secondary"}
            className="ml-auto"
          >
            {session.user.plan === "pro" ? "PRO" : "Free"}
          </Badge>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {session.user.plan === "pro" ? (
            <p>You are on the PRO plan. Billing management coming in Step 5.</p>
          ) : (
            <p>
              You are on the Free plan.{" "}
              <a href="/upgrade" className="text-violet-600 underline underline-offset-2">
                Upgrade to PRO
              </a>{" "}
              for unlimited scans and advanced features.
            </p>
          )}
        </CardContent>
      </Card>

      {/* API key — PRO only, coming in Step 5 */}
    </div>
  );
}
