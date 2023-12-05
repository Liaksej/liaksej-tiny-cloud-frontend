import { lusitana } from "@/ui/fonts";
import { fetchFilesPages } from "@/lib/data";
import Search from "@/ui/dashboard/search";
import Pagination from "@/ui/dashboard/pagination";
import { InvoicesTableSkeleton } from "@/ui/skeletons";
import { Suspense } from "react";
import AdminTable from "@/ui/dashboard/adminTable";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchFilesPages(query);

  return (
    <main id="main">
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl text-orange-700`}>
            Admin panel
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search users..." />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<InvoicesTableSkeleton />}
        >
          <AdminTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
