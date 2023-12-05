"use client";

import { FileEdit } from "@/lib/definitions";
import {
  PencilIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/ui/button";
import { updateFile } from "@/lib/actions";
import { useFormState } from "react-dom";

export default function EdirFileForm({ file }: { file: FileEdit }) {
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(updateFile, initialState);
  return (
    <form action={dispatch} aria-describedby="form-error">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* File ID */}
        <input type="hidden" name="id" value={file.id} />
        {/* Filename */}
        <div className="mb-4">
          <label
            htmlFor="original_name"
            className="mb-2 block text-sm font-medium"
          >
            Edit name
          </label>
          <div className="relative">
            <input
              id="original_name"
              name="original_name"
              type="text"
              aria-describedby="amount-error"
              defaultValue={file.original_name}
              placeholder="Edit filename"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state.errors?.original_name ? (
            <div
              id="original_name-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
            >
              {state.errors?.original_name &&
                state.errors.original_name.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
            </div>
          ) : null}
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label htmlFor="comment" className="mb-2 block text-sm font-medium">
            Edit comment
          </label>
          <div className="relative">
            <input
              id="comment"
              name="comment"
              type="text"
              aria-describedby="comment-error"
              defaultValue={file.comment}
              placeholder="Edit comment"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <ChatBubbleOvalLeftEllipsisIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {state.errors?.comment ? (
            <div
              id="comment-error"
              aria-live="polite"
              className="mt-2 text-sm text-red-500"
            >
              {state.errors?.comment &&
                state.errors.comment.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
            </div>
          ) : null}
        </div>

        {/* Public URL */}
        <div>
          <label
            htmlFor="public_url"
            className="mb-2 block text-sm font-medium"
          >
            Locked / Public
          </label>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="locked"
                  name="public_url"
                  type="radio"
                  value="locked"
                  aria-describedby="public_url-error"
                  defaultChecked={file.public_url === ""}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                />
                <label
                  htmlFor="locked"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  Locked <LockClosedIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="pubclic"
                  name="status"
                  type="radio"
                  value="pubclic"
                  aria-describedby="public_url-error"
                  defaultChecked={file.public_url !== null}
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-gray-600"
                />
                <label
                  htmlFor="pubclic"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white dark:text-gray-300"
                >
                  Public <LockOpenIcon className="h-4 w-4" />
                </label>
              </div>
              {state.errors?.comment ? (
                <div
                  id="public_url-error"
                  aria-live="polite"
                  className="mt-2 text-sm text-red-500"
                >
                  {state.errors?.public_url &&
                    state.errors.public_url.map((error: string) => (
                      <p key={error}>{error}</p>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {state.message ? (
          <div
            id="form-error"
            aria-live="polite"
            className="mt-2 text-sm text-red-500"
          >
            <p>{state.message}</p>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit File</Button>
      </div>
    </form>
  );
}
