import { lusitana } from "@/ui/fonts";
import { fetchFilesPages } from "@/lib/data";
import Search from "@/ui/dashboard/Search";
import Pagination from "@/ui/dashboard/Pagination";
import { DashboardTableSkeleton } from "@/ui/Skeletons";
import { Suspense } from "react";
import DashboardTable from "@/ui/dashboard/DashboardTable";

const DEFAULT_QUERY = "";
const DEFAULT_CURRENT_PAGE = 1;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query ?? DEFAULT_QUERY;
  const currentPage = Number(searchParams?.page) ?? DEFAULT_CURRENT_PAGE;

  const totalPages = await fetchFilesPages(query, "files");

  return (
    <main className="w-full">
      <div>
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Uploaded files</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search by filename..." />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<DashboardTableSkeleton />}
        >
          <DashboardTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
