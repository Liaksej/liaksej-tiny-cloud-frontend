import { auth } from "@/auth";

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
  return (
    <>
      <div>You are logged in correctly!</div>
      <div>{JSON.stringify(session?.user as User | undefined)}</div>
    </>
  );
}
