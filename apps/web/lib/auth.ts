import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { ensureUserDoc } from "./scans";

declare module "next-auth" {
  interface Session {
    user: {
      id:     string;
      name?:  string | null;
      email?: string | null;
      image?: string | null;
      plan:   "free" | "pro";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?:     "free" | "pro";
    githubId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // First sign-in: create/fetch user in Firestore, store plan in JWT
      if (user && account) {
        token.githubId = account.providerAccountId;
        try {
          const plan = await ensureUserDoc(token.sub!, {
            email:    token.email,
            name:     token.name,
            image:    token.picture,
            githubId: account.providerAccountId,
          });
          token.plan = plan;
        } catch {
          // Firebase not configured or unavailable — default to free
          token.plan = "free";
        }
      }

      // On session.update() (e.g. after Stripe upgrade), re-fetch plan from Firestore
      if (trigger === "update" && token.sub) {
        try {
          const { db, FIREBASE_READY } = await import("./firebase-admin");
          if (FIREBASE_READY && db) {
            const doc = await db.collection("users").doc(token.sub).get();
            if (doc.exists) token.plan = (doc.data()!.plan as "free" | "pro") ?? "free";
          }
        } catch {
          // Keep existing plan on error
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id   = token.sub!;
      session.user.plan = token.plan ?? "free";
      return session;
    },
  },

  pages: {
    signIn: "/",
  },
};
