"use client";

import { useFormStatus } from "react-dom";
import { clsx } from "clsx";
import { sendFileToServer } from "@/lib/actions";
import { ReactNode } from "react";

interface ModalUploadInterface {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export default function ModalUpload({ children }: { children: ReactNode }) {
  return <>{children}</>;
}