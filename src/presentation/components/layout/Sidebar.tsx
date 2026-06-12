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
              parentActive
                ? "bg-gray-50 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </span>
            {open ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {open && (
            <div className="mt-1 ml-5 space-y-1 border-l border-gray-200 pl-3">
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
                        ? "bg-bni-light text-bni-primary font-medium"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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

    const active = isActive(item.href ?? "");
    return (
      <Link
        key={item.label}
        to={item.href ?? "#"}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
          active
            ? "bg-bni-light text-bni-primary font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-900 z-50 flex flex-col border-r border-gray-200 transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-bni-primary flex items-center justify-center text-white text-lg font-bold shadow-glow">
            B
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-bold uppercase tracking-wider text-bni-primary">
              BNI Indonesia
            </p>
            <p className="text-base font-bold text-gray-900">Payment Hub</p>
            <p className="text-[11px] text-gray-400">Membership Platform</p>
          </div>
          <button
            className="ml-auto md:hidden text-gray-400 hover:text-gray-700"
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
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </p>
              )}
              {section.items.map(renderItem)}
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-bni-primary flex items-center justify-center text-white font-medium">
              A
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
