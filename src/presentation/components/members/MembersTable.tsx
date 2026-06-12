import type { ReactNode } from "react";
import type { Member } from "@/domain/entities/Member";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { formatDate } from "@/presentation/utils/format";

export interface MemberColumn {
  header: string;
  render: (member: Member) => ReactNode;
}

interface MembersTableProps {
  members: Member[];
  avatar?: "primary" | "muted";
  /** Columns appended after the base columns (e.g. Subscription, Renewal Status). */
  extraColumns?: MemberColumn[];
  /** When provided, an "Actions" column is rendered. */
  renderActions?: (member: Member) => ReactNode;
  emptyText?: string;
}

const avatarClasses: Record<NonNullable<MembersTableProps["avatar"]>, string> = {
  primary: "bg-bni-primary/10 text-bni-primary",
  muted: "bg-gray-100 text-gray-500",
};

export function MembersTable({
  members,
  avatar = "primary",
  extraColumns = [],
  renderActions,
  emptyText = "No members found",
}: MembersTableProps) {
  const avatarClass = avatarClasses[avatar];
  const baseHeaders = ["Name", "Email", "Chapter", "Join Date", "Status"];
  const headers = [
    ...baseHeaders,
    ...extraColumns.map((c) => c.header),
    ...(renderActions ? ["Actions"] : []),
  ];

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${avatarClass}`}>
                      {member.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{member.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{member.email}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{member.chapter}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{formatDate(member.joinDate)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={member.status} />
                </td>
                {extraColumns.map((col) => (
                  <td key={col.header} className="px-5 py-4 text-sm text-gray-600">
                    {col.render(member)}
                  </td>
                ))}
                {renderActions && <td className="px-5 py-4">{renderActions(member)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {members.map((member) => (
          <div key={member.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${avatarClass}`}>
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 uppercase">Chapter</span>
                <span className="text-sm text-gray-900">{member.chapter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 uppercase">Join Date</span>
                <span className="text-sm text-gray-900">{formatDate(member.joinDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 uppercase">Status</span>
                <StatusBadge status={member.status} />
              </div>
              {extraColumns.map((col) => (
                <div key={col.header} className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">{col.header}</span>
                  <span className="text-sm text-gray-900">{col.render(member)}</span>
                </div>
              ))}
            </div>
            {renderActions && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                {renderActions(member)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
