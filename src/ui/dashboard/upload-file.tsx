"use client";

import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useState, MouseEvent } from "react";
import { createPortal, useFormStatus } from "react-dom";
import ModalUpload from "@/ui/dashboard/modal-upload";
import { sendFileToServer } from "@/lib/actions";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

export default function UploadFile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

  const pathname = usePathname();

  function handlerFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];
      setFile(event.target.files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      setIsModalOpen(true);
    }
  }

  const handleClose = () => {
    setFile(undefined);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (file) {
      formData.append("file", file);
      setIsModalOpen(false);
      await sendFileToServer(formData);
      setFile(undefined);
    }
  };

  if (pathname === "/admin") {
    return null;
  }

  return (
    <>
      {isModalOpen &&
        createPortal(
          <ModalUpload>
            <h1 className="font-bold pb-1">File for upload</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 break-words truncate">
              {file?.name}
            </p>
            <form action={handleFormSubmit}>
              <textarea
                className="min-h-[3rem] w-full border-4 dark:bg-gray-950"
                placeholder="Write a message"
                name="comment"
              ></textarea>
              <div className="flex justify-end gap-x-2">
                <button
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-1 px-2 rounded"
                  onClick={handleClose}
                  type="button"
                >
                  Close
                </button>
                <Upload />
              </div>
            </form>
          </ModalUpload>,
          document.getElementById("main") as HTMLElement,
        )}
      <form className="relative flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <input
          type="file"
          className="w-full h-full opacity-0 absolute top-0 left-0"
          onChange={handlerFileChange}
          onClick={(e: MouseEvent<HTMLInputElement>) => {
            e.currentTarget.value = "";
          }}
        />
        <ArrowUpTrayIcon className="w-6" />
        <p className="hidden md:block">Upload File</p>
      </form>
    </>
  );
}

function Upload() {
  const { pending } = useFormStatus();

  return (
    <button
      className={clsx(
        "mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-1 px-2 rounded",
        {
          "bg-gray-400": pending,
        },
      )}
      type="submit"
      aria-disabled={pending}
    >
      {pending ? "Loading" : "Upload"}
    </button>
  );
}
