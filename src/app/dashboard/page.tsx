//
// export default async function DashboardPage() {
//   const session = await auth();
//
//   async function handleSignOut() {
//     "use server";
//     return await signOut();
//   }
//
//   return (
//     <>
//       <div>You are logged in correctly!</div>
//       <div>{JSON.stringify(session?.user)}</div>
//       <form action={handleSignOut}>
//         <button
//           className="mt-4 rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 text-white"
//           type="submit"
//         >
//           Sign out
//         </button>
//       </form>
//       <Link href="/admin" className="mt-4">
//         Админка
//       </Link>
//     </>
//   );
// }
import { auth } from "@/auth.config";
import Cards from "@/ui/dashboard/cards";
import Link from "next/link";
import { lusitana } from "@/ui/fonts";
import { fetchInvoicesPages } from "@/lib/data";
import Search from "@/ui/dashboard/search";
import Table from "@/ui/dashboard/table";
import Pagination from "@/ui/dashboard/pagination";
import { InvoicesTableSkeleton } from "@/ui/skeletons";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);

  return (
    <main id="main">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search invoices..." />
          {/*<CreateInvoice/>*/}
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
