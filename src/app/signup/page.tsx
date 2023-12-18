import CloudLogo from "@/ui/sideNav/CloudLogo";
import SignUpForm from "@/ui/RegistrationForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-12">
        <Link href="/">
          <div className="flex w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
            <div className="w-32 text-white md:w-36">
              <CloudLogo />
            </div>
          </div>
        </Link>
        <SignUpForm />
      </div>
    </main>
  );
}
