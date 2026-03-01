import type { Metadata }        from "next";
import { getServerSession }     from "next-auth";
import { redirect }             from "next/navigation";
import Link                     from "next/link";
import { getTranslations }      from "next-intl/server";
import { authOptions }          from "@/lib/auth";
import { getUsage }             from "@/lib/scans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }                from "@/components/ui/badge";
import { Button }               from "@/components/ui/button";
import { Separator }            from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ManageBillingButton }  from "@/components/upgrade/ManageBillingButton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("settings");
  return { title: t("title") };
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const t = await getTranslations("settings");
  const tCommon = await getTranslations("common");
  const { id: userId, plan, name, email, image } = session.user;
  const usage = await getUsage(userId, plan);

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle className="text-base">{t("profile")}</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{name}</p>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
          <Badge variant={plan === "pro" ? "default" : "secondary"}>
            {plan === "pro" ? tCommon("pro") : tCommon("free")}
          </Badge>
        </CardContent>
      </Card>

      <Separator />

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("usage")} — {usage.period}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {plan === "pro" ? (
            <p className="text-sm text-muted-foreground">
              {t("scansUnlimited", { used: usage.scansThisMonth })}
            </p>
          ) : (
            <>
              <p className="text-sm">
                {t("scansUsed", { used: usage.scansThisMonth, limit: usage.limit ?? 10 })}
              </p>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${Math.min(100, (usage.scansThisMonth / (usage.limit ?? 10)) * 100)}%` }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Billing */}
      <Card>
        <CardHeader><CardTitle className="text-base">{t("billing")}</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {plan === "pro" ? (
            <>
              <p className="text-sm text-muted-foreground">{t("proPlanInfo")}</p>
              <ManageBillingButton />
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{t("upgradePrompt")}</p>
              <Button asChild size="sm" className="self-start bg-violet-600 hover:bg-violet-700">
                <Link href="/upgrade">{t("upgradeCta")}</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* API key — PRO only */}
      {plan === "pro" && (
        <>
          <Separator />
          <Card>
            <CardHeader><CardTitle className="text-base">{t("apiKey")}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("apiKeySoon")}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
