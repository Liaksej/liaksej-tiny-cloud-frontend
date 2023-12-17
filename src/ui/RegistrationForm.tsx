"use client";

import { lusitana } from "@/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/ui/Button";
import { useFormState, useFormStatus } from "react-dom";
import { registrate } from "@/lib/actions";

export default function SignUpForm() {
  const [code, action] = useFormState(registrate, undefined);

  return (
    <form action={action} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please sign in to continue...
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="username"
            >
              Login
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="text"
                name="username"
                minLength={4}
                maxLength={20}
                placeholder="Enter your username"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="flex mt-1 h-5 items-end space-x-1">
              {Boolean(
                code !== null &&
                  typeof code === "object" &&
                  code.errors &&
                  typeof code.errors === "object" &&
                  code.errors.username,
              ) && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p aria-live="polite" className="text-sm text-red-500">
                    {typeof code === "object" &&
                      code.errors &&
                      typeof code.errors === "object" &&
                      code.errors.username}
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-1 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="flex mt-1 h-5 items-end space-x-1">
              {Boolean(
                code !== null &&
                  typeof code === "object" &&
                  code.errors &&
                  typeof code.errors === "object" &&
                  code.errors.email,
              ) && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p aria-live="polite" className="text-sm text-red-500">
                    {typeof code === "object" &&
                      typeof code.errors === "object" &&
                      code.errors.email}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="mt-1">
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="password1"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password1"
                type="password"
                name="password1"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="flex mt-1 h-5 items-end space-x-1">
              {Boolean(
                code !== null &&
                  typeof code === "object" &&
                  code.errors &&
                  typeof code.errors === "object" &&
                  code.errors.password1,
              ) && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p aria-live="polite" className="text-sm text-red-500">
                    {typeof code === "object" &&
                      typeof code.errors === "object" &&
                      code.errors.password1}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="mt-1">
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
              htmlFor="password2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password2"
                type="password"
                name="password2"
                placeholder="Confirm password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="flex mt-1 h-5 items-end space-x-1">
              {Boolean(
                code !== null &&
                  typeof code === "object" &&
                  code.errors &&
                  typeof code.errors === "object" &&
                  code.errors.password2,
              ) && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p aria-live="polite" className="text-sm text-red-500">
                    {typeof code === "object" &&
                      typeof code.errors === "object" &&
                      code.errors.password2}
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-1 block text-xs font-medium text-gray-900"
              htmlFor="first_name"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="first_name"
                type="text"
                name="first_name"
                placeholder="Enter your name"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="flex mt-1 h-5 items-end space-x-1">
              {Boolean(
                code !== null &&
                  typeof code === "object" &&
                  code.errors &&
                  typeof code.errors === "object" &&
                  code.errors.first_name,
              ) && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p aria-live="polite" className="text-sm text-red-500">
                    {typeof code === "object" &&
                      typeof code.errors === "object" &&
                      code.errors.first_name}
                  </p>
                </>
              )}
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-1 block text-xs font-medium text-gray-900"
              htmlFor="last_name"
            >
              Surname
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Enter your surname"
                required
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div className="flex mt-1 h-5 items-end space-x-1">
              {Boolean(
                code !== null &&
                  typeof code === "object" &&
                  code.errors &&
                  typeof code.errors === "object" &&
                  code.errors.last_name,
              ) && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p aria-live="polite" className="text-sm text-red-500">
                    {typeof code === "object" &&
                      typeof code.errors === "object" &&
                      code.errors.last_name}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <LoginButton />
        <div className="flex h-8 items-end space-x-1">
          {Boolean(code) && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p aria-live="polite" className="text-sm text-red-500">
                {code !== null && typeof code === "object" && code?.message
                  ? code?.message
                  : code}
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Sign in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
