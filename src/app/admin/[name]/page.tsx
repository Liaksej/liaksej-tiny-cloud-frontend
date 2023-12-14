import { auth } from "@/auth.config";
import { lusitana } from "@/ui/fonts";
import { fetchFilesPages } from "@/lib/data";
import Search from "@/ui/dashboard/search";
import Pagination from "@/ui/dashboard/pagination";
import { AdminTableSkeleton, DashboardTableSkeleton } from "@/ui/skeletons";
import { Suspense } from "react";
import DashboardTable from "@/ui/dashboard/dashboardTable";
import Breadcrumbs from "@/ui/dashboard/breadcrumbs";

export default async function DashboardPage({
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
  const session = await auth();
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

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
