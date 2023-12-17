import { lusitana } from "@/ui/fonts";
import { fetchFilesPages } from "@/lib/data";
import Search from "@/ui/dashboard/search";
import Pagination from "@/ui/dashboard/pagination";
import { AdminTableSkeleton } from "@/ui/skeletons";
import { Suspense } from "react";
import AdminTable from "@/ui/dashboard/adminTable";

const DEFAULT_QUERY = "";
const DEFAULT_CURRENT_PAGE = 1;

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query ?? DEFAULT_QUERY;
  const currentPage = Number(searchParams?.page) ?? DEFAULT_CURRENT_PAGE;

  const totalPages = await fetchFilesPages(query, "users");

  return (
    <main id="main">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl text-orange-700`}>
            Admin panel
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search by username..." />
        </div>
        <Suspense key={query + currentPage} fallback={<AdminTableSkeleton />}>
          <AdminTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
