import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { navigation, type NavItem } from "@/presentation/config/navigation";
import { getIcon } from "@/presentation/config/icon-map";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { pathname } = useLocation();
  const allItems = navigation.flatMap((s) => s.items);

  const [openMenus, setOpenMenus] = useState<string[]>(() =>
    allItems
      .filter((item) => item.children?.some((c) => c.href === pathname))
      .map((item) => item.label),
  );

  const toggleMenu = (label: string) =>
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label],
    );

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) =>
    item.children?.some((c) => c.href === pathname) ?? false;

  const renderItem = (item: NavItem) => {
    const Icon = getIcon(item.iconName);

    if (item.children) {
      const open = openMenus.includes(item.label);
      const parentActive = isParentActive(item);
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            aria-expanded={open}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors duration-150 ${
              parentActive ? "bg-white/5 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </span>
            {open ? (
              <ChevronDown className="w-4 h-4 opacity-70" />
            ) : (
              <ChevronRight className="w-4 h-4 opacity-70" />
            )}
          </button>

          {open && (
            <div className="mt-1 ml-5 space-y-1 border-l border-white/10 pl-3">
              {item.children.map((sub) => {
                const SubIcon = getIcon(sub.iconName);
                const active = isActive(sub.href);
                return (
                  <Link
                    key={sub.href}
                    to={sub.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                      active
                        ? "bg-bni-primary text-white shadow-glow"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <SubIcon className="w-4 h-4" />
                      <span>{sub.label}</span>
                    </span>
                    {sub.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          active ? "bg-white/25 text-white" : "bg-bni-primary text-white"
                        }`}
                      >
                        {sub.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const active = isActive(item.href ?? "");
    return (
      <Link
        key={item.label}
        to={item.href ?? "#"}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
          active
            ? "bg-bni-primary text-white shadow-glow"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className="bg-bni-primary text-white text-xs px-2 py-0.5 rounded-full ml-auto">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar-gradient text-white z-50 flex flex-col border-r border-white/5 transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-bni-primary flex items-center justify-center text-white text-lg font-bold shadow-glow">
            B
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">BNI Indonesia</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">Payment Dashboard</p>
          </div>
          <button
            className="ml-auto md:hidden text-white/70 hover:text-white"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigation.map((section, idx) => (
            <div key={section.title ?? `section-${idx}`} className="space-y-1">
              {section.title && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                  {section.title}
                </p>
              )}
              {section.items.map(renderItem)}
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-3">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-bni-primary flex items-center justify-center text-white font-medium shadow-glow">
              A
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-white/50">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
