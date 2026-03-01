"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ScanLine, LayoutDashboard, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const t = useTranslations("nav");

  const links = [
    { href: "/analyze",   label: t("analyze"),   icon: ScanLine },
    { href: "/dashboard", label: t("dashboard"),  icon: LayoutDashboard },
    { href: "/settings",  label: t("settings"),   icon: Settings },
    { href: "/upgrade",   label: t("upgrade"),    icon: Zap },
  ];

  // Only show sidebar for authenticated users
  if (status === "loading" || !session) return null;

  return (
    <aside className="hidden md:flex flex-col gap-1 w-44 shrink-0 pt-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/analyze" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
