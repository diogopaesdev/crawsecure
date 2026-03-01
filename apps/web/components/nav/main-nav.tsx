import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { UserMenu } from "./user-menu";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function MainNav() {
  const t = useTranslations("nav");

  const navLinks = [
    { href: "/analyze", label: t("analyze") },
    { href: "/pricing", label: t("pricing") },
    { href: "/trust",   label: t("trust")   },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/icon.svg" alt="CrawSecure" width={28} height={28} priority />
          <span className="text-sm font-semibold tracking-tight">CrawSecure</span>
        </Link>

        {/* Nav links */}
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

        {/* Right: locale switcher + user */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
