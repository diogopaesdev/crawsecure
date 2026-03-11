import { NextResponse } from "next/server";
import { resolveAuth }  from "@/lib/api-auth";
import { getUsage }     from "@/lib/scans";

export async function GET(request: Request) {
  const auth = await resolveAuth(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getUsage(auth.userId, auth.plan);
  return NextResponse.json(usage);
}
