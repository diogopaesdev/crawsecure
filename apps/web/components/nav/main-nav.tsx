import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { UserMenu } from "./user-menu";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-sm tracking-tight">CrawSecure</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/analyze",  label: "Analyze" },
            { href: "/pricing",  label: "Pricing" },
            { href: "/trust",    label: "Trust" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <UserMenu />
      </div>
    </header>
  );
}
