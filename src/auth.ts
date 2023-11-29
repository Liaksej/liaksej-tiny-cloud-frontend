import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

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
});
