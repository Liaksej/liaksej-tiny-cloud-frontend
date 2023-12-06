import { UpdateInvoice, DeleteItem } from "@/ui/dashboard/buttons";
import { formatDateToLocal, formatSize } from "@/lib/utils";
import { fetchTableData } from "@/lib/data";
import { File } from "@/lib/definitions";
import { redirect } from "next/navigation";

export default async function DashboardTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const files = await fetchTableData(query, currentPage, "files");

  if (files.count === 0) {
    return (
      <div className="flex min-h-fit justify-center items-center pt-6 text-gray-400">
        <h1 className="text-ml font-normal">
          There is no files yet. Add some.
        </h1>
      </div>
    );
  }

  if (!files) {
    if (currentPage > 2) {
      redirect(`/dashboard?page=${currentPage - 1}`);
    } else {
      redirect("/dashboard");
    }
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
                  <p className="font-bold">{file["original_name"]}</p>
                  <p className="text-sm text-gray-500">{file.comment}</p>
                  {/*<InvoiceStatus status={file.status} />*/}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    {/*<p className="text-xl font-medium">*/}
                    {/*  {formatCurrency(file.amount)}*/}
                    {/*</p>*/}
                    <p className="text-xl font-medium">
                      {formatSize(file.size)}
                    </p>
                    <p>{formatDateToLocal(file["date_created"])}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={file.id} />
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Created
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Downloaded
                </th>
                {/*<th scope="col" className="px-3 py-5 font-medium">*/}
                {/*  Status*/}
                {/*</th>*/}
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
                      <p>{file.original_name}</p>
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
                    {formatDateToLocal(file.date_downloaded)}
                  </td>
                  {/*<td className="whitespace-nowrap px-3 py-3">*/}
                  {/*  <InvoiceStatus status={invoice.status} />*/}
                  {/*</td>*/}
                  <td className="whitespace-nowrap py-3 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={file.id} />
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
