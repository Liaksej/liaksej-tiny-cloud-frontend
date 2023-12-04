"use client";

import Link from "next/link";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

export default function AdminLink() {
  return (
    <Link
      href="/admin"
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <AdjustmentsHorizontalIcon className="w-6" />
      <p className="hidden md:block">Admin panel</p>
    </Link>
  );
}
