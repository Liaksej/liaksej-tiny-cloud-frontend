"use client";

import {
  ArrowUpTrayIcon,
  DocumentIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, useState, MouseEvent } from "react";
import { createPortal, useFormStatus } from "react-dom";
import ModalUpload from "@/ui/dashboard/ModalUpload";
import { sendFileToServer } from "@/lib/actions";
import { usePathname } from "next/navigation";
import { lusitana } from "@/ui/fonts";
import { Button } from "@/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export default function UploadFile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [alertFileSize, setAlertFileSize] = useState<string | undefined>(
    undefined,
  );

  const pathname = usePathname();

  function handlerFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];

      const maxFileSize = 200 * 1024 * 1024;

      if (file.size > maxFileSize) {
        setAlertFileSize("File size exceeds the maximum limit of 200MB.");
      }

      setFile(event.target.files[0]);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      setIsModalOpen(true);
    }
  }

  const handleClose = () => {
    setFile(undefined);
    setAlertFileSize(undefined);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (file) {
      formData.append("file", file);
      formData.append("file_name", file.name);
      await sendFileToServer(formData);
      setIsModalOpen(false);
      setFile(undefined);
      setAlertFileSize(undefined);
    }
  };

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {isModalOpen &&
        createPortal(
          <ModalUpload>
            <form
              action={handleFormSubmit}
              className="space-y-3 absolute top-1/5 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 md:min-w-[25%] md:w-fit w-full"
            >
              <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 border border-gray-400 shadow-2xl">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                  Upload Form
                </h1>
                <div className="w-full">
                  <div>
                    <label
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Filename
                    </label>
                    <div className="relative">
                      <p
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-3.5 text-sm outline-2 placeholder:text-gray-500"
                        id="email"
                      >
                        {file?.name}
                      </p>
                      <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Comment
                    </label>
                    <div className="relative">
                      <textarea
                        className="peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                        id="password"
                        name="password"
                        placeholder="Enter comment..."
                        rows={3}
                        maxLength={150}
                      />
                    </div>
                  </div>
                  <div className="flex mt-1 h-5 items-end space-x-1">
                    {Boolean(alertFileSize) && (
                      <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p aria-live="polite" className="text-sm text-red-500">
                          {alertFileSize}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <UploadButton disabled={Boolean(alertFileSize)} />
                <div onClick={handleClose}>
                  <CancelButton />
                </div>
                <div className="flex h-8 items-end space-x-1"></div>
              </div>
            </form>
          </ModalUpload>,
          document.getElementById("main") as HTMLElement,
        )}
      <form
        className={clsx(
          "relative flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
          {
            "text-gray-400 hover:bg-gray-50 hover:text-gray-400": isModalOpen,
          },
        )}
      >
        <input
          type="file"
          className="w-full h-full opacity-0 absolute top-0 left-0"
          onChange={handlerFileChange}
          onClick={(e: MouseEvent<HTMLInputElement>) => {
            e.currentTarget.value = "";
          }}
          disabled={isModalOpen}
        />
        <ArrowUpTrayIcon className="w-6" />
        <p className="hidden md:block">Upload File</p>
      </form>
    </>
  );
}

export function UploadButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" disabled={disabled} aria-disabled={pending}>
      Upload <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}

export function CancelButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="mt-4 w-full bg-gray-400 hover:bg-gray-300"
      aria-disabled={pending}
    >
      Cancel <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
