import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { AuthUser } from "@/lib/definitions";
import { adminCheck } from "@/lib/data";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60; // 7 days

async function fetchAuthDataFromBackend(
  endpoint: string,
  body: { email: string; password: string } | { refresh: string },
  method: "POST" | "GET" = "POST",
) {
  const response = await fetch(
    `${process.env.NEXTAUTH_BACKEND_URL}${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    },
  );
  if (response.ok) {
    return await response.json();
  }

  console.error("Error with http request: " + response.status);
  return null;
}

function getCurrentEpochTime() {
  return Math.floor(Date.now() / 1000);
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: BACKEND_REFRESH_TOKEN_LIFETIME,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const data = await fetchAuthDataFromBackend("auth/login/", {
            email,
            password,
          });
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
        const data = await fetchAuthDataFromBackend("auth/token/refresh/", {
          refresh: token.refresh as string,
        });
        if (!data) {
          console.log("Error refreshing access token" + data.status);
          return await signOut();
        }
        token.access = data.access;
        token.expires = currentEpochTime + BACKEND_ACCESS_TOKEN_LIFETIME;
        return token;
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
      const path = nextUrl.pathname;

      switch (true) {
        case path.startsWith("/signup"):
          return isLoggedIn
            ? Response.redirect(new URL("/dashboard", nextUrl))
            : true;
        case path.startsWith("/admin"):
          return isLoggedIn
            ? await adminCheck()
            : Response.redirect(new URL("/login", nextUrl));
        case path.startsWith("/download"):
          return isLoggedIn ? true : Response.redirect(new URL("/", nextUrl));
        case path.startsWith("/public"):
          return true;
        case path.startsWith("/dashboard"):
          return isLoggedIn;
        default:
          return isLoggedIn
            ? Response.redirect(new URL("/dashboard", nextUrl))
            : true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(authConfig);
