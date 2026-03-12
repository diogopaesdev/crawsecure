"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { UserMenu } from "./user-menu";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function MainNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/analyze", label: t("analyze") },
    { href: "/pricing", label: t("pricing") },
    { href: "/trust",   label: t("trust")   },
  ];

  return (
    <header className="sticky top-0 z-50 flex flex-col items-center px-4 pt-3 pb-0 pointer-events-none">

      {/* ── Pill ─────────────────────────────────────────────────────────── */}
      <div className="pointer-events-auto w-full sm:w-auto rounded-2xl border border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
        <div className="flex h-11 items-center px-3 gap-1">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 px-1.5 shrink-0">
            <Image src="/icon.svg" alt="CrawSecure" width={20} height={20} priority />
            <span className="text-sm font-semibold tracking-tight">CrawSecure</span>
          </Link>

          {/* Separator */}
          <span className="hidden md:block h-4 w-px bg-border/70 mx-2 shrink-0" />

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Separator */}
          <span className="hidden md:block h-4 w-px bg-border/70 mx-2 shrink-0" />

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <div className="hidden sm:block">
              <LocaleSwitcher />
            </div>
            <div className="hidden md:block">
              <UserMenu />
            </div>
            {/* Mobile burger */}
            <button
              className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile dropdown pill ─────────────────────────────────────────── */}
      {open && (
        <div className="pointer-events-auto mt-2 w-full sm:w-72 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-md shadow-sm px-3 py-2.5 flex flex-col gap-0.5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-border/50 mt-1.5 pt-2 flex items-center justify-between">
            <LocaleSwitcher />
            <UserMenu />
          </div>
        </div>
      )}

    </header>
  );
}
