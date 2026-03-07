import { NextResponse }       from "next/server";
import { generateApiKey }     from "@/lib/api-keys";
import { db, FIREBASE_READY } from "@/lib/firebase-admin";

// POST /api/auth/cli/token — { githubToken } → { token, name, plan }
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { githubToken } = (body as Record<string, unknown>);
  if (typeof githubToken !== "string" || !githubToken) {
    return NextResponse.json({ error: "Missing githubToken" }, { status: 400 });
  }

  // Verify GitHub token and get user info
  let githubUser: { id: number; login: string };
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept:        "application/vnd.github+json",
        "User-Agent":  "CrawSecure-CLI",
      },
    });
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    githubUser = await res.json() as { id: number; login: string };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "GitHub verification failed";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  if (!FIREBASE_READY || !db) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }

  const githubIdStr = String(githubUser.id);
  const snap = await db
    .collection("users")
    .where("githubId", "==", githubIdStr)
    .limit(1)
    .get();

  let userId: string;
  let plan: "free" | "pro" = "free";

  if (snap.empty) {
    const newRef = db.collection("users").doc();
    userId       = newRef.id;
    await newRef.set({
      id:          userId,
      githubId:    githubIdStr,
      displayName: githubUser.login,
      plan:        "free",
      createdAt:   new Date(),
      lastSeenAt:  new Date(),
    });
  } else {
    const doc = snap.docs[0];
    userId    = doc.id;
    plan      = (doc.data().plan as "free" | "pro") ?? "free";
    await doc.ref.update({ lastSeenAt: new Date() });
  }

  const plainKey = await generateApiKey(userId);
  return NextResponse.json({ token: plainKey, name: githubUser.login, plan }, { status: 200 });
}
