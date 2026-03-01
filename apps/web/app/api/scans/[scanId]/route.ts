import { NextResponse }     from "next/server";
import { getServerSession } from "next-auth";
import { authOptions }      from "@/lib/auth";
import { deleteScan }       from "@/lib/scans";

// DELETE /api/scans/:scanId — deletes a scan owned by the current user.

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ scanId: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scanId } = await params;

  try {
    await deleteScan(scanId, session.user.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    const status  = message === "Forbidden" ? 403 : 503;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ ok: true });
}
