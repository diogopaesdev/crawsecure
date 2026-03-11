import { NextResponse } from "next/server";

// GET /api/auth/cli/config — public, client_id is not a secret
export function GET() {
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  if (!githubClientId) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  return NextResponse.json({ githubClientId });
}
