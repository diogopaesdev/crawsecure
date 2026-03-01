import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: "free" | "pro";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: "free" | "pro";
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
    async jwt({ token, user }) {
      if (user) {
        // plan is synced from Firestore in step 4; defaults to "free"
        token.plan = "free";
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
