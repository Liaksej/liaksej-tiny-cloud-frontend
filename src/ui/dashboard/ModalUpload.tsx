"use client";

import { ReactNode } from "react";

export default function ModalUpload({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full absolute bg-gray-50/70 top-0">{children}</div>
  );
}
