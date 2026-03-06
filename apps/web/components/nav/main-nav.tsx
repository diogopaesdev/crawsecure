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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/icon.svg" alt="CrawSecure" width={26} height={26} priority />
          <span className="text-sm font-semibold tracking-tight">CrawSecure</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: locale switcher + user + mobile burger */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <div className="hidden sm:block">
            <UserMenu />
          </div>
          {/* Mobile burger */}
          <button
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/50 bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border/50 mt-1">
            <UserMenu />
          </div>
        </div>
      )}
    </header>
  );
}
