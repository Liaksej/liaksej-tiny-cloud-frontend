import { CloudIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/ui/fonts";

export default function CloudLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <CloudIcon className="h-30 w-32" />
      <p className="text-[32px]">Tiny Cloud</p>
    </div>
  );
}
