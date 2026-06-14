import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

/** Breadcrumb trail for detail pages. The last item renders as the current page. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.to && !last ? (
              <Link to={c.to} className="hover:text-bni-primary transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "font-medium text-gray-900" : ""}>{c.label}</span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
          </span>
        );
      })}
    </nav>
  );
}
