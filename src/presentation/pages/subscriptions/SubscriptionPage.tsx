import { useState } from "react";
import { Plus, Download, FileText, Eye, Pencil } from "lucide-react";
import type { Subscription } from "@/domain/entities/Subscription";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { formatCurrency, formatDate } from "@/presentation/utils/format";

export function SubscriptionPage() {
  const { getSubscriptions } = useServices();
  const [search, setSearch] = useState("");
  const { data } = useAsync(() => getSubscriptions.execute(search), [search]);
  const rows = data ?? [];

  const columns: Column<Subscription>[] = [
    {
      key: "member",
      header: "Member",
      primary: true,
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{s.memberName}</p>
            <p className="text-xs text-gray-500">{s.memberId}</p>
          </div>
        </div>
      ),
    },
    { key: "plan", header: "Plan", cell: (s) => <span className="font-medium text-gray-900">{s.plan}</span> },
    { key: "amount", header: "Amount", cell: (s) => formatCurrency(s.amount) },
    { key: "start", header: "Start Date", cell: (s) => formatDate(s.startDate) },
    { key: "end", header: "End Date", cell: (s) => formatDate(s.endDate) },
    { key: "status", header: "Status", cell: (s) => <StatusBadge status={s.status} /> },
    {
      key: "actions",
      header: "Actions",
      actions: true,
      cell: () => (
        <div className="flex items-center gap-1">
          <IconButton label="View">
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton label="Edit">
            <Pencil className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Data"
        actions={
          <button className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            New Subscription
          </button>
        }
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search subscription..."
          ariaLabel="Search subscription"
          className="flex-1"
        />
        <button className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export
        </button>
      </FilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(s) => s.id}
        emptyText="No subscriptions found"
      />
    </div>
  );
}
