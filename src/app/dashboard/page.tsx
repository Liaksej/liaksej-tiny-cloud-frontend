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
import { Suspense } from "react";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/ui/skeletons";

export default async function Page() {
  const session = await auth();
  return (
    <main id="main">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Files
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <div></div>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <div></div>
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <div></div>
        </Suspense>
        <div>You are logged in correctly!</div>
        <div>{JSON.stringify(session?.user)}</div>
      </div>
    </main>
  );
}
