import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu, User, LogOut } from "lucide-react";
import { getPageTitle } from "@/presentation/config/navigation";
import { useAuth } from "@/presentation/auth/AuthProvider";
import { useToast } from "@/presentation/providers/ToastProvider";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const title = getPageTitle(pathname);

  const roleLabel = user
    ? `${user.role}${user.chapterName ? ` · ${user.chapterName}` : ""}`
    : "";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl border-b border-gray-200/60 shadow-soft">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Buka menu"
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center bg-gray-100/80 rounded-full px-4 py-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-bni-primary/25 focus-within:shadow-soft">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="bg-transparent border-none outline-none text-sm ml-2 w-44"
            />
          </div>

          <button
            onClick={() => toast("Tidak ada notifikasi baru", "info")}
            aria-label="Notifikasi"
            className="relative p-2.5 hover:bg-gray-100 rounded-xl text-gray-600"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bni-primary rounded-full ring-2 ring-white" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              aria-label="Menu pengguna"
              aria-expanded={showUserMenu}
              className="flex items-center gap-2.5 p-1.5 md:pl-3 hover:bg-gray-100 rounded-xl"
            >
              <div className="hidden md:block text-right leading-tight">
                <p className="text-sm font-medium text-gray-900">{user?.name ?? "—"}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-sm font-semibold shadow-glow">
                {user?.name.charAt(0) ?? "?"}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden="true"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200/80 rounded-xl shadow-card-hover py-1.5 z-20">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name ?? "—"}</p>
                    <p className="text-xs text-gray-500">{user?.email ?? ""}</p>
                    {roleLabel && (
                      <span className="inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-full bg-bni-primary/10 text-bni-primary font-medium">
                        {roleLabel}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      toast("Halaman profil belum tersedia", "info");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
