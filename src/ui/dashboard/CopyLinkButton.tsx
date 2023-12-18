"use client";

import clsx from "clsx";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import Link from "next/link";

export function CopyLinkButton({ public_url }: { public_url: string | null }) {
  const tooltip = useRef<HTMLSpanElement | null>(null);
  const copyToClipboard = async () => {
    if (public_url) {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_HOSTNAME}public/${public_url}`,
      );
      if (tooltip.current) {
        tooltip.current?.classList.remove("hidden");

        setTimeout(() => {
          tooltip.current?.classList.add("hidden");
        }, 700);
      }
    }
  };

  return (
    <Link
      href={
        public_url
          ? `${process.env.NEXT_PUBLIC_HOSTNAME}public/${public_url}`
          : `${process.env.NEXT_PUBLIC_HOSTNAME}`
      }
      onClick={(e) => e.preventDefault()}
    >
      <button type="button" onClick={copyToClipboard} disabled={!public_url}>
        <div
          className={clsx(
            "rounded-md border p-2 hover:bg-gray-100 flex justify-center relative",
            !public_url && "bg-gray-200 hover:bg-gray-200 opacity-25",
          )}
        >
          <span className="sr-only">Copy Link</span>
          <ClipboardDocumentIcon className="w-5" />

          <span ref={tooltip} className="hidden absolute -top-2.5">
            Copied!
          </span>
        </div>
      </button>
    </Link>
  );
}
