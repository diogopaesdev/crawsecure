import { NextResponse }      from "next/server";
import { getServerSession }  from "next-auth";
import { z }                 from "zod";
import { v4 as uuid }        from "uuid";
import { authOptions }       from "@/lib/auth";
import { saveScan, getUsage, FREE_SCAN_LIMIT } from "@/lib/scans";

// ── Validation schema ──────────────────────────────────────────────────────
// Only accepts aggregated signals — never file contents or paths.

const saveScanSchema = z.object({
  scanId: z.string().uuid().optional(),
  summary: z.object({
    critical: z.number().int().min(0).max(1000),
    warning:  z.number().int().min(0).max(1000),
    info:     z.number().int().min(0).max(1000),
  }),
  score:          z.number().min(0).max(100_000),
  risk:           z.enum(["SAFE", "MEDIUM", "HIGH"]),
  rulesTriggered: z.array(z.string().max(50)).max(20),
  filesScanned:   z.number().int().min(0).max(100_000),
});

// ── POST /api/scans ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = saveScanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const { summary, score, risk, rulesTriggered, filesScanned } = parsed.data;
  const userId = session.user.id;
  const plan   = session.user.plan;

  // Check usage limit
  const usage = await getUsage(userId, plan);
  if (usage.limit !== null && usage.scansThisMonth >= usage.limit) {
    return NextResponse.json(
      {
        error:   "Monthly scan limit reached",
        limit:   FREE_SCAN_LIMIT,
        current: usage.scansThisMonth,
        upgrade: "/upgrade",
      },
      { status: 429 },
    );
  }

  // Persist to Firestore
  const scanId = parsed.data.scanId ?? uuid();
  try {
    await saveScan({ scanId, userId, summary, score, risk, rulesTriggered, filesScanned });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save scan";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  return NextResponse.json({ ok: true, scanId }, { status: 201 });
}
