"use client";

import { updateAdminStatus } from "@/lib/actions";
import { useRef } from "react";
import { clsx } from "clsx";

export default function UpdateAdminStatus({
  username,
  authuser,
  admin,
}: {
  username: string;
  authuser: string;
  admin: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={form}
      action={updateAdminStatus}
      onChange={(event) => event.currentTarget.requestSubmit()}
    >
      <input type="hidden" name="username" value={username} />
      <input
        className={clsx("rounded", username === authuser && "text-gray-400")}
        type="checkbox"
        name="is_superuser"
        defaultChecked={admin}
        value={`${admin}`}
        disabled={username === authuser}
      />
    </form>
  );
}
