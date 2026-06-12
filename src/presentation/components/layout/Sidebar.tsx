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

  // Auto-expand the group containing the active route (fixes deep links).
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
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            aria-expanded={open}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-150 ${
              isParentActive(item)
                ? "bg-bni-light text-bni-primary border-l-4 border-bni-primary"
                : "hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </span>
            {open ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {open && (
            <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-2">
              {item.children.map((sub) => {
                const SubIcon = getIcon(sub.iconName);
                return (
                  <Link
                    key={sub.href}
                    to={sub.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                      isActive(sub.href)
                        ? "bg-bni-light text-bni-primary"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <SubIcon className="w-4 h-4" />
                      <span>{sub.label}</span>
                    </span>
                    {sub.badge && (
                      <span className="bg-bni-primary text-white text-xs px-2 py-0.5 rounded-full">
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

    return (
      <Link
        key={item.label}
        to={item.href ?? "#"}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
          isActive(item.href ?? "")
            ? "bg-bni-light text-bni-primary border-l-4 border-bni-primary"
            : "hover:bg-white/10"
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-sidebar text-white z-50 flex flex-col transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <span className="text-2xl font-bold text-bni-primary">BNI</span>
          <button
            className="ml-auto md:hidden text-white/70 hover:text-white"
            onClick={onClose}
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {navigation.map((section, idx) => (
            <div key={section.title ?? `section-${idx}`} className="space-y-1">
              {section.title && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  {section.title}
                </p>
              )}
              {section.items.map(renderItem)}
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bni-primary flex items-center justify-center text-white font-medium">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-white/60">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
