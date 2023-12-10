import Breadcrumbs from "@/ui/dashboard/breadcrumbs";
import { fetchFile } from "@/lib/data";
import { notFound } from "next/navigation";
import { FileEdit } from "@/lib/definitions";
import EdirFileForm from "@/ui/dashboard/edit-file-form";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const file = (await fetchFile(id)) as FileEdit;

  if (!file) {
    return notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Uploaded file", href: "/dashboard" },
          {
            label: `${file.original_name}`,
            href: `/dashboard/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EdirFileForm file={file} />
    </main>
  );
}
