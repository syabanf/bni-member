import type { Column } from "@/presentation/components/ui/DataTable";
import type { Member } from "@/domain/entities/Member";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";

/** Shared read-only member columns for drill-down sub-tables (city/chapter/downline). */
export const memberColumns: Column<Member>[] = [
  {
    key: "name",
    header: "Nama",
    primary: true,
    sortValue: (m) => m.name,
    cell: (m) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bni-primary/10 text-sm font-medium text-bni-primary">
          {m.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{m.name}</p>
          <p className="text-xs text-gray-500">{m.classification}</p>
        </div>
      </div>
    ),
  },
  { key: "chapter", header: "Chapter", sortValue: (m) => m.chapter, cell: (m) => m.chapter },
  { key: "role", header: "Role", sortValue: (m) => m.role, cell: (m) => m.role },
  { key: "status", header: "Status", sortValue: (m) => m.status, cell: (m) => <StatusBadge status={m.status} /> },
];
