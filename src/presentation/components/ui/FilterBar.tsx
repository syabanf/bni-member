import type { ReactNode } from "react";

/** Standardised filter container: a card holding search + selects + actions. */
export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">{children}</div>
    </div>
  );
}
