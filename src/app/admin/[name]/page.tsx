import { fetchFilesPages } from "@/lib/data";
import Search from "@/ui/dashboard/Search";
import Pagination from "@/ui/dashboard/Pagination";
import { DashboardTableSkeleton } from "@/ui/skeletons";
import { Suspense } from "react";
import DashboardTable from "@/ui/dashboard/DashboardTable";
import Breadcrumbs from "@/ui/dashboard/Breadcrumbs";

const DEFAULT_QUERY = "";
const DEFAULT_CURRENT_PAGE = 1;

export default async function UsersDashboardForAdmin({
  searchParams,
  params,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  params: {
    name: "users" | "files";
  };
}) {
  const query = searchParams?.query ?? DEFAULT_QUERY;
  const currentPage = Number(searchParams?.page) ?? DEFAULT_CURRENT_PAGE;

  const totalPages = await fetchFilesPages(query, params.name);

  return (
    <main className="w-full">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin Panel", href: "/admin" },
          {
            label: `${params.name}`,
            href: `/admin/${params.name}`,
            active: true,
          },
        ]}
      />
      <div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search invoices..." />
        </div>
        <Suspense
          key={query + currentPage}
          fallback={<DashboardTableSkeleton />}
        >
          <DashboardTable
            query={query}
            currentPage={currentPage}
            name={params.name}
          />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
