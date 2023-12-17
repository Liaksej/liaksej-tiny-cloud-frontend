"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PencilIcon } from "@heroicons/react/24/outline";

export function UpdateFileInfo({ id, name }: { id: string; name?: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={
        pathname.startsWith(`/admin/${name}`)
          ? `/admin/${name}/${id}/edit`
          : `/dashboard/${id}/edit`
      }
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
