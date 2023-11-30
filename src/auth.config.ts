import NextAuth, { NextAuthConfig, Session } from "next-auth";
import { LoginData } from "@/lib/definitions";
import { cookies } from "next/headers";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  refresh?: string;
  access?: string;
  refreshExpires?: string;
}

async function getUser(email: string, password: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_BACKEND_URL}auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
  if (response.ok) {
    const data = await response.json();
    return data;
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

          const user = {
            id: data.user.pk,
            email: data.user.email,
            name: data.user.username,
            access: data.access,
            refresh: data.refresh,
            refreshExpires:
              getCurrentEpochTime() + BACKEND_REFRESH_TOKEN_LIFETIME,
          };

          return user;
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
      const wideUser = user as User;
      if (user) {
        token.refresh = wideUser.refresh;
        token.access = wideUser.access;
        token.expires = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
        token.refreshExpires = wideUser.refreshExpires;
        return token;
      }
      if (token.expires && getCurrentEpochTime > token.expires) {
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
          token.expires = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
          return token;
        } else {
          console.log("Error refreshing access token" + response.status);
          return token;
        }
      }
      const currentEpochTime = getCurrentEpochTime();
      if (
        token.refreshExpires &&
        currentEpochTime > Number(token.refreshExpires)
      ) {
        return await signOut();
      }
      return token;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unathenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(authConfig);
