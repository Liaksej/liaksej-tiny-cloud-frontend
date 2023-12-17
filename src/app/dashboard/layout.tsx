import SideNav from "@/ui/dashboard/sidenav";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div id="main" className="relative flex-grow">
        <div className="p-6 md:overflow-y-auto md:p-12 h-full">{children}</div>
      </div>
    </div>
  );
}
