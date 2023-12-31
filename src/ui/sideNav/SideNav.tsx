import Link from "next/link";
import UploadFile from "@/ui/sideNav/UploadFile";
import CloudLogo from "./CloudLogo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth.config";
import AdminLink from "@/ui/sideNav/AdminLink";
import { adminCheck } from "@/lib/data";

export default async function SideNav() {
  const admin = await adminCheck();
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-35 items-end justify-start rounded-md bg-blue-600 p-4 md:h-fit"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <CloudLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <UploadFile />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {admin && <AdminLink />}
        <form
          className="flex h-[48px]"
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="flex w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
