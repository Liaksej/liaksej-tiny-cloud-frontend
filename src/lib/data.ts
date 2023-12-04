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

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const session = await auth();

  try {
    const filesResponse = await fetch(
      `http://localhost:8000/api/cloud/files/${
        currentPage !== 1 ? `?page=${currentPage}` : ""
      }`,
      {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
      },
    );
    if (!filesResponse.ok) {
      throw new Error("Failed to fetch invoices.");
    }
    return await filesResponse.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch files.");
  }
}

export async function fetchInvoicesPages(query: string | number) {
  noStore();
  const session = await auth();
  try {
    const countResponse = await fetch(
      `http://127.0.0.1:8000/api/cloud/files/`,
      {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${session?.user?.access}`,
        },
      },
    );

    if (!countResponse.ok) {
      throw new Error("Failed to fetch invoices.");
    }

    const { count } = await countResponse.json();

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error("Failed to fetch total number of files.");
  }
}

// export async function fetchInvoiceById(id: string) {
//   noStore();
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;
//
//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));
//
//     return invoice[0];
//   } catch (error) {
//     console.error("Database Error:", error);
//   }
// }

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
