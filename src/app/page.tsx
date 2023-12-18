import CloudLogo from "@/ui/sideNav/CloudLogo";

import Link from "next/link";
import { lusitana } from "@/ui/fonts";
import Image from "next/image";
export default function MainPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <CloudLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to Tiny Cloud.</strong>
          </p>
          <div className="flex gap-6">
            <Link
              href="/signup"
              className="flex items-center gap-5 self-start rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-500 md:text-base"
            >
              <span>Sign up</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Log in</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={600}
            height={600}
            className="hidden md:block"
            alt="Screenshots of the project logo"
          />
          <Image
            src="/hero-desktop.png"
            width={300}
            height={300}
            className="md:hidden block"
            alt="Screenshots of the project logo"
          />
        </div>
      </div>
    </main>
  );
}
