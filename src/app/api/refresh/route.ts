import { cookies } from "next/headers";

export async function POST(request: Request) {
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
    const { access } = await response.json();
    return new Response("Hello, Next.js!", {
      status: 200,
      headers: { "Set-Cookie": `access=${access}` },
    });
  } else {
    return new Response("Hello, Next.js!", {
      status: 401,
    });
  }
}
