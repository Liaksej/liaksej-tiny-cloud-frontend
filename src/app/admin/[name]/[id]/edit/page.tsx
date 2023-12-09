import Breadcrumbs from "@/ui/dashboard/breadcrumbs";
import { fetchFile } from "@/lib/data";
import { notFound } from "next/navigation";
import { FileEdit } from "@/lib/definitions";
import EdirFileForm from "@/ui/dashboard/edit-file-form";

export default async function Page({
  params,
}: {
  params: { name: string; id: string };
}) {
  const { name, id } = params;
  const file = (await fetchFile(id)) as FileEdit;

  if (!file) {
    return notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Admin Panel", href: "/admin" },
          {
            label: `${name}`,
            href: `/admin/${name}`,
            active: true,
          },
          {
            label: `${file.original_name}`,
            href: `/admin/${name}/${file.original_name}/edit`,
            active: true,
          },
        ]}
      />
      <EdirFileForm file={file} />
    </main>
  );
}
