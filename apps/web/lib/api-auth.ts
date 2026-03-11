import { getServerSession } from "next-auth";
import { authOptions }      from "./auth";
import { verifyApiKey }     from "./api-keys";
import { db, FIREBASE_READY } from "./firebase-admin";

export interface ResolvedAuth {
  userId: string;
  plan:   "free" | "pro";
}

/**
 * Resolve auth from either:
 *  1. Authorization: Bearer cws_xxx  (CLI API key)
 *  2. Next-Auth session cookie        (web app)
 *
 * Returns null if neither is present / valid.
 */
export async function resolveAuth(request: Request): Promise<ResolvedAuth | null> {
  // 1. Try Bearer token
  const authHeader = request.headers.get("Authorization") ?? "";
  if (authHeader.startsWith("Bearer cws_")) {
    const token  = authHeader.slice("Bearer ".length);
    const result = await verifyApiKey(token);
    if (!result) return null;

    const plan = await getUserPlan(result.userId);
    return { userId: result.userId, plan };
  }

  // 2. Fall back to session
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return { userId: session.user.id, plan: session.user.plan };
}

async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  if (!FIREBASE_READY || !db) return "free";
  try {
    const doc = await db.collection("users").doc(userId).get();
    return (doc.data()?.plan as "free" | "pro") ?? "free";
  } catch {
    return "free";
  }
}
