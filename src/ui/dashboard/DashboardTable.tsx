import { DeleteItem } from "@/ui/dashboard/Buttons";
import { formatDateToLocal, formatSize } from "@/lib/utils";
import { fetchTableData } from "@/lib/data";
import { File } from "@/lib/definitions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CopyLinkButton } from "@/ui/dashboard/CopyLinkButton";
import { UpdateFileInfo } from "@/ui/dashboard/UpdateInfoButton";

export default async function DashboardTable({
  query,
  currentPage,
  name,
}: {
  query: string;
  currentPage: number;
  name?: string;
}) {
  const files = await fetchTableData(query, currentPage, "files", name);

  if (!files) {
    if (currentPage > 2) {
      redirect(`/dashboard?page=${currentPage - 1}`);
    } else {
      redirect("/dashboard");
    }
  }

  if (files.count === 0) {
    return (
      <div className="flex min-h-fit justify-center items-center pt-6 text-gray-400">
        <h1 className="text-ml font-normal">
          There is no files yet. Add some.
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {files.results?.map((file: File) => (
              <div
                key={file.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <Link
                    href={`/download/${file.id}`}
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    <p className="font-bold">{file.original_name}</p>
                  </Link>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p>{formatSize(file.size)}</p>
                    <p>{`upl: ${formatDateToLocal(file["date_created"])}`}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateFileInfo id={file.id} name={name} />
                    <DeleteItem id={file.id} type="file" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  File name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Comment
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Size
                </th>
                <th scope="col" className="py-5 font-medium">
                  Created
                </th>
                <th scope="col" className="py-5 font-medium">
                  Downloaded
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Public Link
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {files.results?.map((file: File) => (
                <tr
                  key={file.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6">
                    <div className="flex items-center gap-3 font-medium">
                      <Link
                        className="text-blue-600 underline"
                        href={`/download/${file.id}`}
                        target="_blank"
                      >
                        <p>{file.original_name}</p>
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 pr-14 py-3">
                    {file.comment}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatSize(file.size)}
                  </td>
                  <td className="whitespace-nowrap py-3">
                    {formatDateToLocal(file.date_created)}
                  </td>
                  <td className="whitespace-nowrap py-3">
                    {file.date_downloaded
                      ? formatDateToLocal(file.date_downloaded)
                      : "n/a"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <CopyLinkButton public_url={file.public_url} />
                  </td>
                  <td className="whitespace-nowrap py-3 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateFileInfo id={file.id} name={name} />
                      <DeleteItem id={file.id} type="file" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
