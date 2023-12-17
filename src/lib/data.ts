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

    if (
      response.status === 404 &&
      (endpoint === "auth/users/" || endpoint === "cloud/files/")
    ) {
      const info = await response.json();
      if (info.detail == "Invalid page.") {
        return;
      }
    }

    if (!response.ok) {
      console.error("Fetch Error:", response.statusText);
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(`Failed to fetch ${endpoint}`);
  }
}

export async function fetchTableData(
  query: string,
  currentPage: number,
  type: "files" | "users",
  name?: string,
) {
  return await fetchDataFromAPI(
    `${type === "users" ? "auth/users/" : "cloud/files/"}`,
    { username: name, page: currentPage > 1 ? currentPage : null, q: query },
  );
}

export async function fetchFilesPages(
  query: string | number,
  type: "files" | "users",
  name?: string,
) {
  const data = await fetchDataFromAPI(
    `${type === "users" ? "auth/users/" : "cloud/files/"}`,
    { username: name, q: query },
  );
  return Math.ceil(data.count / ITEMS_PER_PAGE);
}

export async function fetchFile(id: string) {
  return await fetchDataFromAPI(`cloud/files/${id}`);
}

export async function adminCheck() {
  const session = await auth();
  const data = await fetchDataFromAPI(`auth/users/${session?.user?.name}/`);
  return !!data.is_staff;
}
