import { NextResponse }     from "next/server";
import { getServerSession } from "next-auth";
import { authOptions }      from "@/lib/auth";
import { getUsage }         from "@/lib/scans";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getUsage(session.user.id, session.user.plan);
  return NextResponse.json(usage);
}
