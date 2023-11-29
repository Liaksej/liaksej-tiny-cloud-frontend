import type { NextAuthConfig } from "next-auth";
import { LoginData } from "@/lib/definitions";

// These two values should be a bit less than actual token lifetimes
const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

function getCurrentEpochTime() {
  return Math.floor(Date.now() / 1000);
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
    // async jwt({ token, user, account }) {
    //   if (user && account) {
    //     let backendResponse: any =
    //       account.provider === "credentials" ? user : account.meta;
    //     token.user = backendResponse.user;
    //     token.access_token = backendResponse.access;
    //     token.refresh_token = backendResponse.refresh;
    //     token.ref = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
    //     return token;
    //   }
    //   if (getCurrentEpochTime() > (token.ref as number)) {
    //     const response = await fetch(
    //       `${process.env.NEXTAUTH_BACKEND_URL}/auth/token/refresh/`,
    //       {
    //         method: "POST",
    //         body: JSON.stringify({
    //           refresh: token.refresh_token,
    //         }),
    //       },
    //     );
    //     if (!response.ok) {
    //       console.log("Error refreshing token");
    //       return null;
    //     }
    //     const data = await response.json();
    //     token.access_token = data.access;
    //     token["refresh_token"] = data.refresh;
    //     token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
    //   }
    //   return token;
    // },
  },
} satisfies NextAuthConfig;
