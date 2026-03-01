import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protect all routes under /(app) — redirect unauthenticated users to /
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/",
    },
  },
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/upgrade/:path*",
    "/api/scans/:path*",
    "/api/checkout",
    "/api/portal",
    "/api/usage",
  ],
};
