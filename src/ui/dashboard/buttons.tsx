import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteFile, deleteUser } from "@/lib/actions";
import { clsx } from "clsx";

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteItem({
  id,
  type,
  admin,
  authuser,
}: {
  id: string | number;
  type: "user" | "file";
  admin?: boolean;
  authuser?: string;
}) {
  return (
    <>
      <form action={type === "file" ? deleteFile : deleteUser}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          disabled={type === "user" && id === authuser}
          className={clsx(
            "rounded-md border p-2 hover:bg-gray-100",
            type === "user" &&
              id === authuser &&
              "bg-gray-400 hover:bg-gray-400",
          )}
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
