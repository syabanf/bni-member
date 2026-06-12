import type { ReactNode } from "react";
import type { Member } from "@/domain/entities/Member";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { formatDate } from "@/presentation/utils/format";

export interface MemberColumn {
  header: string;
  render: (member: Member) => ReactNode;
}

interface MembersTableProps {
  members: Member[];
  avatar?: "primary" | "muted";
  /** Columns appended after the base columns (e.g. Subscription, Sponsor). */
  extraColumns?: MemberColumn[];
  /** When provided, an "Actions" column is rendered. */
  renderActions?: (member: Member) => ReactNode;
  emptyText?: string;
}

const avatarClasses = {
  primary: "bg-bni-primary/10 text-bni-primary",
  muted: "bg-gray-100 text-gray-500",
} as const;

export function MembersTable({
  members,
  avatar = "primary",
  extraColumns = [],
  renderActions,
  emptyText = "No members found",
}: MembersTableProps) {
  const avatarClass = avatarClasses[avatar];

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: "Name",
      primary: true,
      cell: (m) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${avatarClass}`}>
            {m.name.charAt(0)}
          </div>
          <span className="text-sm font-medium text-gray-900">{m.name}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", cell: (m) => m.email },
    { key: "chapter", header: "Chapter", cell: (m) => m.chapter },
    { key: "joinDate", header: "Join Date", cell: (m) => formatDate(m.joinDate) },
    { key: "status", header: "Status", cell: (m) => <StatusBadge status={m.status} /> },
    ...extraColumns.map(
      (c, i): Column<Member> => ({ key: `extra-${i}`, header: c.header, cell: c.render }),
    ),
    ...(renderActions
      ? [{ key: "actions", header: "Actions", actions: true, cell: renderActions } as Column<Member>]
      : []),
  ];

  return (
    <DataTable columns={columns} rows={members} rowKey={(m) => m.id} emptyText={emptyText} />
  );
}
