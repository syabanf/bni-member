import type { MemberStatus } from "@/domain/entities/Member";

interface StatusBadgeProps {
  status: MemberStatus | string;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  Active: { bg: "bg-success/10", text: "text-success", label: "Active" },
  Pending: { bg: "bg-warning/10", text: "text-warning", label: "Pending" },
  Overdue: { bg: "bg-danger/10", text: "text-danger", label: "Overdue" },
  Expired: { bg: "bg-gray-100", text: "text-gray-500", label: "Expired" },
  Paid: { bg: "bg-success/10", text: "text-success", label: "Paid" },
  Outstanding: { bg: "bg-bni-primary/10", text: "text-bni-primary", label: "Outstanding" },
  Awaiting: { bg: "bg-warning/10", text: "text-warning", label: "Awaiting" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config =
    statusConfig[status] ?? { bg: "bg-gray-100", text: "text-gray-500", label: status };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
