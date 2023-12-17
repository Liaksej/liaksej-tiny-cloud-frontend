"use server";

import { auth, signIn } from "@/auth.config";
import { revalidatePath } from "next/cache";
import { FileEditSchema, State } from "@/lib/definitions";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
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
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}cloud/files/`,
      {
        method: "POST",
        headers: {
          ContentType: "multipart/form-data",
          Authorization: `Bearer ${session?.user?.access}`,
        },
        body: formData,
      },
    );
    if (response.ok) {
      revalidatePath("/dashboard");
      return null;
    } else {
      console.error("Upload fetch is failed");
      revalidatePath("/dashboard");
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
    console.error("Upload fetch is failed");
    revalidatePath("/dashboard");
    throw new Error("Upload fetch is failed.");
  }
}

export async function deleteFile(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      console.error("No session");
    }
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}cloud/files/${formData.get("id")}`,
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
    public: formData.get("public") === "True",
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed Save Changes.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}cloud/files/${validateFields.data.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
        body: JSON.stringify(validateFields.data),
      },
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (e) {
    return { message: "Fetch Error: Failed to Save Changes." };
  }
  revalidatePath("../");
  redirect("../");
}

export async function updateAdminStatus(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      console.error("No session");
    }
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}auth/users/${formData.get(
        "username",
      )}/`,
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

export async function registrate(
  prevState:
    | undefined
    | {
        errors:
          | {
              email?: string[];
              username?: string[];
              password1?: string[];
              password2?: string[];
              first_name?: string[];
              last_name?: string[];
            }
          | string;

        message: string;
      },

  formData: FormData,
) {
  const credentials = Object.fromEntries(formData);

  const credentialsSchema = z
    .object({
      email: z.string().email(),
      username: z
        .string()
        .min(4)
        .max(20, {
          message: "Username must be between 4 and 20 characters",
        })
        .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
          message:
            "Username must start with a letter and contain only letters and numbers",
        }),
      password1: z
        .string()
        .min(6)
        .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
          message:
            "Password must contain at least one uppercase letter, one number, and one special character",
        }),
      password2: z
        .string()
        .min(6)
        .refine((val) => val === credentials.password1, {
          message: "Passwords do not match",
          path: ["password2"],
        }),
      first_name: z.string().min(1),
      last_name: z.string().min(1),
    })
    .safeParse(credentials);

  if (!credentialsSchema.success) {
    return {
      errors: credentialsSchema.error.flatten().fieldErrors,
      message: "Missing Fields. Failed Registration.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}auth/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      },
    );

    if (response.status === 400) {
      const error = await response.json();
      if (
        error.username &&
        error.username[0] === "A user with that username already exists."
      ) {
        return {
          errors: response.statusText,
          message: error.username[0],
        };
      }
      if (error.password1 && error.password1[0]) {
        return {
          errors: response.statusText,
          message: error.password1[0],
        };
      }
      return {
        errors: response.statusText,
        message: "Error with credentials",
      };
    }

    if (response.ok) {
      await signIn("credentials", {
        email: credentials.email,
        password: credentials.password1,
      });
    }
  } catch (error) {
    return {
      errors: (error as Error).message,
      message: "Something went wrong. Failed Registration.",
    };
  }
  return;
}
