import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/presentation/components/layout/Sidebar";
import { Topbar } from "@/presentation/components/layout/Topbar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 md:ml-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">
          {/* key on route → subtle fade/slide as each page mounts */}
          <div key={pathname} className="mx-auto max-w-[1600px] animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
