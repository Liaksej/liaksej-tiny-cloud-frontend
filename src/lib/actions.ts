"use server";

import { signIn, auth } from "@/auth.config";
import { revalidatePath } from "next/cache";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialSignin";
    }
    throw error;
  }
}

export async function sendFileToServer(formData: FormData) {
  const session = await auth();
  try {
    if (!session) {
      console.error("No session");
    }
    const response = await fetch("http://127.0.0.1:8000/api/cloud/files/", {
      method: "POST",
      headers: {
        ContentType: "multipart/form-data",
        Authorization: `Bearer ${session?.user?.access}`,
      },
      body: formData,
    });
    if (response.ok) {
      return revalidatePath("/dashboard");
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteInvoice(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      console.error("No session");
    }
    const response = await fetch(
      `http://127.0.0.1:8000/api/cloud/files/${formData.get("id")}/`,
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath("/dashboard");
    return { message: "Deleted File." };
  } catch (e) {
    return { message: "Fetch Error: Failed to Delete File." };
  }
}
