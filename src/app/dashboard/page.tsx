import { auth, signOut } from "@/auth.config";
import { getSession } from "next-auth/react";

interface User {
  refresh: string;
  access: string;
  expires: number;
  iat: number;
  exp: number;
  jti: string;
}

export default async function DashboardPage() {
  const session = await auth();

  async function handleSignOut() {
    "use server";
    return await signOut();
  }

  return (
    <>
      <div>You are logged in correctly!</div>
      <div>{JSON.stringify(session?.user)}</div>
      <form action={handleSignOut}>
        <button
          className="mt-4 rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 text-white"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </>
  );
}
