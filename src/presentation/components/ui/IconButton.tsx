import type { ReactNode } from "react";

interface IconButtonProps {
  onClick?: () => void;
  label: string;
  tone?: "default" | "danger";
  children: ReactNode;
}

/** Standardised icon-only action button for table rows. */
export function IconButton({ onClick, label, tone = "default", children }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 ${
        tone === "danger" ? "hover:text-danger" : "hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
