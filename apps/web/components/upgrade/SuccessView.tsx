"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessView() {
  const { update } = useSession();
  const t  = useTranslations("upgrade");
  const tc = useTranslations("common");
  const [ready, setReady] = useState(false);

  // Refresh the session JWT to pick up plan: "pro" from Firestore.
  // We wait for update() to settle before showing navigation buttons —
  // otherwise the user can click through before the cookie is updated.
  useEffect(() => {
    update().finally(() => setReady(true));
  }, [update]);

  if (!ready) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{tc("loading")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <span className="text-6xl">🎉</span>
      <h1 className="text-2xl font-semibold">{t("successTitle")}</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        {t("successSubtitle")}
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/dashboard">{t("successButton")}</Link>
        </Button>
      </div>
    </div>
  );
}
