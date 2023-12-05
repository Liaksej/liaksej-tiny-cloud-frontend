"use client";

import Link from "next/link";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function AdminLink() {
  const pathname = usePathname();

  return (
    <Link
      href={pathname === "/admin" ? "/dashboard" : "/admin"}
      className={clsx(
        "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
        {
          "bg-orange-400 hover:bg-orange-500 hover:text-red-900":
            pathname === "/admin",
        },
      )}
    >
      <AdjustmentsHorizontalIcon className="w-6" />
      <div className="flex justify-between w-[calc(100%-1.8rem)] pr-3">
        <p className="hidden md:block">Admin panel</p>
        <p className="text-red-700">{pathname === "/admin" ? "ON" : ""}</p>
      </div>
    </Link>
  );
}
