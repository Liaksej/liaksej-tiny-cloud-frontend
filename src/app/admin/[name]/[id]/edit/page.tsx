import Breadcrumbs from "@/ui/dashboard/Breadcrumbs";
import { fetchFile } from "@/lib/data";
import { notFound } from "next/navigation";
import { FileEdit } from "@/lib/definitions";
import EditFileForm from "@/ui/dashboard/EditFileForm";

export default async function EditPage({
  params: { name, id },
}: {
  params: { name: string; id: string };
}) {
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
            active: false,
          },
          {
            label: `${file.original_name}`,
            href: `/admin/${name}/${file.original_name}/edit`,
            active: true,
          },
        ]}
      />
      <EditFileForm file={file} />
    </main>
  );
}
