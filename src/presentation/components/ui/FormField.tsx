import type { ReactNode } from "react";

/** Shared input/select styling for forms. */
export const fieldInputClass =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20 disabled:bg-gray-50";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-xs font-medium text-gray-600 mb-1">
        {label}
        {required && <span className="text-bni-primary"> *</span>}
      </span>
      {children}
    </label>
  );
}
