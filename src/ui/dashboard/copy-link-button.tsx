"use client";

import clsx from "clsx";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

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
    <button type="button" onClick={copyToClipboard} disabled={!public_url}>
      <div
        className={clsx(
          "rounded-md border p-2 hover:bg-gray-100 flex justify-center relative",
          !public_url && "bg-gray-200 hover:bg-gray-200 opacity-25",
        )}
      >
        <span className="sr-only">Delete</span>
        <ClipboardDocumentIcon className="w-5" />

        <span ref={tooltip} className="hidden absolute -top-2.5">
          Copied!
        </span>
      </div>
    </button>
  );
}