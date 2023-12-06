"use server";

import { signIn, auth } from "@/auth.config";
import { revalidatePath } from "next/cache";
import { FileEditSchema, State } from "@/lib/definitions";
import { redirect } from "next/navigation";

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

export async function deleteFile(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      console.error("No session");
    }
    const response = await fetch(
      `http://127.0.0.1:8000/api/cloud/files/${formData.get("id")}`,
      {
        method: "DELETE",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath("/dashboard");
    return { message: "Deleted File." };
  } catch (e) {
    revalidatePath("/dashboard");
    return { message: "Fetch Error: Failed to Delete File." };
  }
}

export async function deleteUser(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      console.error("No session");
    }
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}auth/users/${formData.get("id")}`,
      {
        method: "DELETE",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    revalidatePath("/dashboard");
    return { message: "User Deleted." };
  } catch (e) {
    revalidatePath("/dashboard");
    return { message: "Fetch Error: Failed to Delete User." };
  }
}

export async function updateFile(prevState: State, formData: FormData) {
  const session = await auth();

  const validateFields = FileEditSchema.safeParse({
    id: formData.get("id"),
    original_name: formData.get("original_name"),
    comment: formData.get("comment"),
    public_url: formData.get("public_url"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed Save Changes.",
    };
  }

  const { id, original_name, comment, public_url } = validateFields.data;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/cloud/files/${id}`,
      {
        method: "PATCH",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
        body: JSON.stringify({ original_name, comment, public_url }),
      },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (e) {
    return { message: "Database Error: Failed to Update Invoice." };
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateAdminStatus(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      console.error("No session");
    }
    const response = await fetch(
      `http://127.0.0.1:8000/api/auth/users/${formData.get("username")}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
        body: JSON.stringify({
          is_staff: `${formData.get("is_staff") === "false"}`,
        }),
      },
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
