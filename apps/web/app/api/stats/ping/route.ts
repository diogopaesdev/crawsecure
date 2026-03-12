import { NextResponse } from "next/server";
import { incrementScanCount } from "@/lib/stats";

export async function POST() {
  await incrementScanCount();
  return NextResponse.json({ ok: true });
}
