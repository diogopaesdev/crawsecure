import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication (page routes, without locale prefix)
const PROTECTED_PAGES = ["/dashboard", "/settings", "/upgrade", "/analyze"];
// API routes that require authentication
const PROTECTED_API   = ["/api/scans", "/api/checkout", "/api/portal", "/api/usage"];

// Regex matching non-default locale prefixes
const LOCALE_PREFIX_RE = new RegExp(
  `^/(${routing.locales.filter(l => l !== routing.defaultLocale).join("|")})(\/|$)`
);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── API routes: skip intl, enforce auth only ─────────────────────────────
  if (pathname.startsWith("/api/")) {
    const needsAuth = PROTECTED_API.some(p => pathname.startsWith(p));
    if (needsAuth) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // ── Page routes: check auth for protected paths ───────────────────────────
  const stripped = pathname.replace(LOCALE_PREFIX_RE, "/");
  const needsAuth = PROTECTED_PAGES.some(
    p => stripped === p || stripped.startsWith(p + "/")
  );

  if (needsAuth) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      const localeMatch = pathname.match(LOCALE_PREFIX_RE);
      url.pathname = localeMatch ? `/${localeMatch[1]}` : "/";
      return NextResponse.redirect(url);
    }
  }

  // ── Let next-intl handle locale routing for all page requests ────────────
  return intlMiddleware(req);
}

export const config = {
  // Match all paths except static files, _next internals, and the icon
  matcher: ["/((?!_next|_vercel|icon\\.svg|favicon\\.ico|.*\\..*).*)"],
};
