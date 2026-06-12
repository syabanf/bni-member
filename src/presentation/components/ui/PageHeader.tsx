import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {actions}
    </div>
  );
}
