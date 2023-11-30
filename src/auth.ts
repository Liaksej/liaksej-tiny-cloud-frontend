import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig, getCurrentEpochTime } from "./auth.config";
import { cookies } from "next/headers";

const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60; // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60; // 6 days

async function getUser(email: string, password: string) {
  const response = await fetch(
    `${process.env.NEXTAUTH_BACKEND_URL}auth/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
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

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email, password);
          if (!user) return null;

          return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.refresh = user.refresh;
        token.access = user.access;
        token.expires = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
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
          console.log(data);
          token.access = data.access;
          token.expires = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME;
          return token;
        } else {
          console.log("Error refreshing access token" + response.status);
          return null;
        }
      }
      return token;
    },
    async session({ session }) {
      return session.user;
    },
  },
});
