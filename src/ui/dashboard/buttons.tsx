import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteFile } from "@/lib/actions";

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

export function DeleteFile({ id }: { id: string | number }) {
  return (
    <>
      <form action={deleteFile}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-gray-100"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
