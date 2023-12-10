import { DeleteItem } from "@/ui/dashboard/buttons";
import { formatDateToLocal, formatSize } from "@/lib/utils";
import { fetchTableData } from "@/lib/data";
import { User } from "@/lib/definitions";
import UpdateAdminStatus from "@/ui/dashboard/change-admin-status-button";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const session = await auth();
  const users = await fetchTableData(query, currentPage, "users");

  if (!users) {
    if (currentPage > 2) {
      redirect(`/users?page=${currentPage - 1}`);
    } else {
      redirect("/users");
    }
  }

  if (users.count === 0) {
    return (
      <div className="flex min-h-fit justify-center items-center pt-6 text-gray-400">
        <h1 className="text-ml font-normal">There is no users yet.</h1>
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {users.results?.map((user: User) => (
              <div
                key={user.username}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <p className="font-bold">{user["username"]}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.first_name}</p>
                  <p className="text-sm text-gray-500">{user.last_name}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{user.count_files}</p>
                    <p className="text-xl font-medium">
                      {formatSize(user.total_space.size__sum)}
                    </p>
                    <p>{formatDateToLocal(user.date_joined)}</p>
                    <p>{formatDateToLocal(user.last_login)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DeleteItem id={user.username} type="user" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Username
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Full name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Files
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total size
                </th>
                <th scope="col" className="py-5 font-medium">
                  Joined
                </th>
                <th scope="col" className="py-5 font-medium">
                  Last login
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Admin
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-1">
                  <span>Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.results?.map((user: User) => (
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6">
                    <div className="flex items-center gap-3 font-medium">
                      <Link
                        className="underline text-blue-700"
                        href={`/admin/${user.username}`}
                      >
                        {user.username}
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{user.email}</td>
                  <td className="whitespace-nowrap px-3 pr-14 py-3">
                    {user.first_name}
                    {user.last_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.count_files}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatSize(user.total_space.size__sum || 0)}
                  </td>
                  <td className="whitespace-nowrap py-3">
                    {formatDateToLocal(user.date_joined)}
                  </td>
                  <td className="whitespace-nowrap py-3">
                    {formatDateToLocal(user.last_login)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <div className="flex gap-3">
                      <UpdateAdminStatus
                        username={user.username}
                        authuser={session?.user?.name as string}
                        admin={user.is_staff}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap pl-6 pr-1">
                    <div className="flex">
                      <DeleteItem
                        id={user.username}
                        type="user"
                        admin={user.is_staff}
                        authuser={session?.user?.name as string}
                      />
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
