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
  Forming: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Forming" },
  Inactive: { bg: "bg-gray-100", text: "text-gray-500", label: "Inactive" },
  // Referral statuses
  Open: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Open" },
  "In Progress": { bg: "bg-warning/10", text: "text-warning", label: "In Progress" },
  Closed: { bg: "bg-success/10", text: "text-success", label: "Closed" },
  Cancelled: { bg: "bg-gray-100", text: "text-gray-500", label: "Cancelled" },
  // Visitor funnel statuses
  Invited: { bg: "bg-blue-500/10", text: "text-blue-500", label: "Invited" },
  Attended: { bg: "bg-warning/10", text: "text-warning", label: "Attended" },
  Applied: { bg: "bg-bni-primary/10", text: "text-bni-primary", label: "Applied" },
  Member: { bg: "bg-success/10", text: "text-success", label: "Member" },
  Declined: { bg: "bg-gray-100", text: "text-gray-500", label: "Declined" },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config =
    statusConfig[status] ?? { bg: "bg-gray-100", text: "text-gray-500", label: status };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
