import { auth } from "@/auth.config";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!params || !params.id) {
    throw new Error(`Parameters are required`);
  }
  const session = await auth();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}cloud/download/${params.id}/`,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.access}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Response failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");

  if (!contentDisposition) {
    throw new Error(`Content-Disposition header not found`);
  }
  return new Response(blob, {
    headers: {
      "Content-Type": blob.type,
      "Content-Disposition": contentDisposition,
    },
  });
}
