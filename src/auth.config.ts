import type { NextAuthConfig, Session } from "next-auth";
import { LoginData } from "@/lib/definitions";
import { cookies } from "next/headers";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

export function getCurrentEpochTime() {
  return Math.floor(Date.now() / 1000);
}

async function generateNewAccessToken() {
  if (!cookies().get("refresh")) {
    return null;
  }
  const response = await fetch(
    `${process.env.NEXTAUTH_BACKEND_URL}auth/token/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: cookies().get("refresh")?.value,
      }),
    },
  );
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    cookies().set("access", data.access, {
      maxAge: getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME,
    });
    return data.access;
  } else {
    console.log("Error refreshing access token" + response.status);
    return null;
  }
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
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
