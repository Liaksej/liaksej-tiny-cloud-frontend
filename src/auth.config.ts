import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { AuthUser } from "@/lib/definitions";
import { adminCheck } from "@/lib/data";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days

async function getUser(email: string, password: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_BACKEND_URL}auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
  if (response.ok) {
    return await response.json();
  } else {
    console.log("Error logging in" + response.status);
    return null;
  }
}

export function getCurrentEpochTime() {
  return Math.floor(Date.now() / 1000);
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  debug: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const data = await getUser(email, password);
          if (!data) return null;

          return {
            id: data.user.pk,
            email: data.user.email,
            name: data.user.username,
            access: data.access,
            refresh: data.refresh,
            refreshExpires:
              getCurrentEpochTime() + BACKEND_REFRESH_TOKEN_LIFETIME,
          };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.access = token.access as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      const wideUser = user as AuthUser;
      const currentEpochTime = getCurrentEpochTime();
      if (user) {
        token.refresh = wideUser.refresh;
        token.access = wideUser.access;
        token.expires = currentEpochTime + BACKEND_ACCESS_TOKEN_LIFETIME;
        token.refreshExpires = wideUser.refreshExpires;
        return token;
      }
      if (token.expires && currentEpochTime > Number(token.expires)) {
        const response = await fetch(
          `${process.env.NEXTAUTH_BACKEND_URL}auth/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh: token.refresh,
            }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          token.access = data.access;
          token.expires = currentEpochTime + BACKEND_ACCESS_TOKEN_LIFETIME;
          return token;
        } else {
          console.log("Error refreshing access token" + response.status);
          return await signOut();
        }
      }
      if (
        token.refreshExpires &&
        currentEpochTime > Number(token.refreshExpires)
      ) {
        token.refresh = undefined;
        token.access = undefined;
        return await signOut();
      }
      return token;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) {
        return adminCheck();
      }
      // const isOnStatic = nextUrl.pathname.startsWith("/static");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(authConfig);
