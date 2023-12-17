import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth.config";

// export async function fetchLatestInvoices() {
//   noStore();
//   try {
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;
//
//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch the latest invoices.");
//   }
// }

const ITEMS_PER_PAGE = 10;

export async function fetchTableData(
  query: string,
  currentPage: number,
  type: "files" | "users",
  name?: string,
) {
  noStore();
  const session = await auth();

  const params = new Map<string, string | number | null>([
    ["username", name ? name : null],
    ["page", currentPage > 1 ? currentPage : null],
    ["q", query ? query : null],
  ]);

  const url = new URL(
    `${process.env.NEXTAUTH_BACKEND_URL}${
      type === "users" ? "auth/users/" : "cloud/files/"
    }`,
  );

  params.forEach((value, key) => {
    if (value === null) return;

    url.searchParams.append(key, value.toString());
  });

  try {
    const response = await fetch(url, {
      headers: {
        ContentType: "application/json",
        Authorization: `Bearer ${session?.user?.access}`,
      },
    });
    if (response.status === 404) {
      const info = await response.json();
      if (info.detail == "Invalid page.") {
        return;
      }
    }
    if (!response.ok) {
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
  noStore();
  const session = await auth();

  const params = new Map<string, string | number | null>([
    ["username", name ? name : null],
    ["q", query ? query : null],
  ]);

  const url = new URL(
    `${process.env.NEXTAUTH_BACKEND_URL}${
      type === "users" ? "auth/users/" : "cloud/files/"
    }`,
  );

  params.forEach((value, key) => {
    if (value === null) return;

    url.searchParams.append(key, value.toString());
  });

  try {
    const countResponse = await fetch(url, {
      headers: {
        ContentType: "application/json",
        Authorization: `Bearer ${session?.user?.access}`,
      },
    });

    if (!countResponse.ok) {
      throw new Error("Failed to fetch invoices.");
    }

    const { count } = await countResponse.json();

    return Math.ceil(Number(count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch total number of files!!!!!.");
  }
}

export async function fetchFile(id: string) {
  noStore();
  const session = await auth();
  try {
    const countResponse = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}cloud/files/${id}`,
      {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
      },
    );

    if (!countResponse.ok) {
      throw new Error("Failed to fetch file.");
    }

    return await countResponse.json();
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

export async function adminCheck() {
  noStore();

  const session = await auth();

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_BACKEND_URL}auth/users/${session?.user?.name}/`,
      {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return !!data.is_staff;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// export async function fetchCustomers() {
//   noStore();
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;
//
//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error("Database Error:", err);
//     throw new Error("Failed to fetch all customers.");
//   }
// }

// export async function fetchFilteredCustomers(query: string) {
//   noStore();
//   try {
//     const data = await sql<CustomersTable>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;
//
//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));
//
//     return customers;
//   } catch (err) {
//     console.error("Database Error:", err);
//     throw new Error("Failed to fetch customer table.");
//   }
// }

// export async function getUser(email: string) {
//   try {
//     const user = await sql`SELECT * from USERS where email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error("Failed to fetch user:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }
