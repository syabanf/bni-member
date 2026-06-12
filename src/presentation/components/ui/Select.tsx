import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  /** Show the type-to-filter search box (default true). */
  searchable?: boolean;
}

const MENU_MAX_H = 300;

/**
 * Accessible custom dropdown with a type-to-filter search box and a scrollable
 * options panel. The panel is portal-rendered with fixed positioning (and flips
 * above when low on space), so it is never clipped by scroll containers/modals.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Pilih...",
  ariaLabel,
  className,
  searchable = true,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setQuery("");
    setOpen(true);
  };

  const pick = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    if (searchable) searchRef.current?.focus();
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, searchable]);

  const menuStyle = (): CSSProperties => {
    if (!rect) return {};
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < MENU_MAX_H + 8 && rect.top > spaceBelow;
    return openUp
      ? { position: "fixed", bottom: window.innerHeight - rect.top + 4, left: rect.left, width: rect.width }
      : { position: "fixed", top: rect.bottom + 4, left: rect.left, width: rect.width };
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
      >
        <span className={`truncate ${selected ? "text-gray-900" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[100]"
              aria-hidden="true"
              onClick={() => setOpen(false)}
            />
            <div
              style={menuStyle()}
              className="z-[101] rounded-xl border border-gray-200 bg-white shadow-card-hover overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (filtered[0]) pick(filtered[0].value);
                        }
                      }}
                      placeholder="Cari..."
                      aria-label="Cari opsi"
                      className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
                    />
                  </div>
                </div>
              )}

              <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-sm text-gray-400">Tidak ditemukan</li>
                )}
                {filtered.map((o) => {
                  const active = o.value === value;
                  return (
                    <li key={o.value} role="option" aria-selected={active}>
                      <button
                        type="button"
                        onClick={() => pick(o.value)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left transition-colors ${
                          active
                            ? "bg-bni-light text-bni-primary font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="truncate">{o.label}</span>
                        {active && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
