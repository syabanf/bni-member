import type { ReactNode } from "react";

interface PageHeroProps {
  /** Small red label above the title, e.g. "BNI INDONESIA". */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Right-aligned action buttons. */
  actions?: ReactNode;
}

/** Prominent page header rendered as a card (eyebrow + title + description). */
export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-card border border-gray-100/80 p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-bni-primary/5 blur-3xl"
      />
      <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-bni-primary mb-1.5">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
