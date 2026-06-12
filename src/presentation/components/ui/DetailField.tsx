import type { ReactNode } from "react";

interface DetailFieldProps {
  label: string;
  children: ReactNode;
}

/** A labelled read-only value used inside detail modals. */
export function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-900">{children}</div>
    </div>
  );
}
