import { NextResponse }      from "next/server";
import { getServerSession }  from "next-auth";
import { authOptions }       from "@/lib/auth";
import { generateApiKey }    from "@/lib/api-keys";

// POST /api/auth/cli/regenerate
// Requires active web session (not API key — this is a settings UI action).
// Revokes the existing key and generates a new one.

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plainKey = await generateApiKey(session.user.id);
  return NextResponse.json({ token: plainKey }, { status: 200 });
}
