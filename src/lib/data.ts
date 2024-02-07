import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth.config";

const ITEMS_PER_PAGE = 10;

async function fetchDataFromAPI(
  endpoint: string,
  queryParams?: Record<string, any>,
  method = "GET",
) {
  noStore();
  const session = await auth();
  const url = new URL(`${process.env.NEXTAUTH_BACKEND_URL}${endpoint}`);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ContentType: "application/json",
        Authorization: `Bearer ${session?.user?.access}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch" + endpoint);
  }
}

export async function fetchTableData(
  query: string,
  currentPage: number,
  type: "files" | "users",
  name?: string,
) {
  noStore();
  try {
    const response = await fetchDataFromAPI(
      `${type === "users" ? "auth/users/" : "cloud/files/"}`,
      { username: name, page: currentPage > 1 ? currentPage : null, q: query },
    );

    if (response?.status === 404) {
      const info = await response.json();
      if (info.detail == "Invalid page.") {
        return;
      }
    }
    if (!response?.ok) {
      throw new Error("Failed to fetch table data.");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch table data.");
  }
}

export async function fetchFilesPages(
  query: string | number,
  type: "files" | "users",
  name?: string,
) {
  try {
    const response = await fetchDataFromAPI(
      `${type === "users" ? "auth/users/" : "cloud/files/"}`,
      { username: name, q: query },
    );

    if (!response?.ok) {
      throw new Error("Failed to fetch invoices.");
    }

    const { count } = await response.json();

    return Math.ceil(Number(count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch total number of files.");
  }
}

export async function fetchFile(id: string) {
  try {
    const response = await fetchDataFromAPI(`cloud/files/${id}`);

    if (!response?.ok) {
      throw new Error("Failed to fetch file.");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

export async function adminCheck() {
  const session = await auth();
  try {
    const response = await fetchDataFromAPI(
      `auth/users/${session?.user?.name}/`,
    );
    if (response?.ok) {
      const data = await response.json();
      return !!data.is_staff;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}
