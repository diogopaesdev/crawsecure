import Link from "next/link";
import { UserMenu } from "./user-menu";
import { Badge } from "@/components/ui/badge";

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 flex h-14 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
          <span className="text-lg">🔍</span>
          <span>CrawSecure</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">v2</Badge>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/analyze" className="hover:text-foreground transition-colors">
            Analyze
          </Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/trust" className="hover:text-foreground transition-colors">
            Trust
          </Link>
        </nav>

        {/* User */}
        <UserMenu />
      </div>
    </header>
  );
}
