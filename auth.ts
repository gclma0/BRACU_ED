import NextAuth, { type DefaultSession } from "next-auth";

import { db } from "./lib/prisma";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      if (token.name && session.user) {
        session.user.name = token.name;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      try {
        const userExist = await db.profile.findFirst({
          where: { id: token.sub },
        });
        if (!userExist) return token;
        token.role = userExist.role;
        token.name = userExist.name;
      } catch (error) {
        console.error("Error fetching user in JWT callback:", error);
        // Return token without additional data if database query fails
      }

      return token;
    },
  },

  session: { strategy: "jwt" },
  ...authConfig,
});
