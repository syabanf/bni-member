import { useState } from "react";
import { Plus, Download, FileText, Eye, Pencil } from "lucide-react";
import type { Subscription } from "@/domain/entities/Subscription";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { formatCurrency, formatDate } from "@/presentation/utils/format";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";

export function SubscriptionPage() {
  const { getSubscriptions, getMembers } = useServices();
  const [search, setSearch] = useState("");
  const [chapterFilter, setChapterFilter] = useState(ALL);
  const { data } = useAsync(() => getSubscriptions.execute(search), [search]);
  const { data: allSubs } = useAsync(() => getSubscriptions.execute(""), []);
  const { data: memberData } = useAsync(() => getMembers.execute({}), []);
  const all = allSubs ?? [];
  const totalValue = all.reduce((s, x) => s + x.amount, 0);
  const memberChapter = new Map((memberData ?? []).map((m) => [m.id, m.chapter]));
  const rows = (data ?? []).filter(
    (s) => chapterFilter === ALL || memberChapter.get(s.memberId) === chapterFilter,
  );

  const columns: Column<Subscription>[] = [
    {
      key: "member",
      header: "Member",
      primary: true,
      sortValue: (s) => s.memberName,
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{s.memberName}</p>
            <p className="text-xs text-gray-500">{memberChapter.get(s.memberId) ?? "—"}</p>
          </div>
        </div>
      ),
    },
    { key: "plan", header: "Plan", sortValue: (s) => s.plan, cell: (s) => <span className="font-medium text-gray-900">{s.plan}</span> },
    { key: "amount", header: "Amount", sortValue: (s) => s.amount, cell: (s) => formatCurrency(s.amount) },
    { key: "start", header: "Start Date", sortValue: (s) => s.startDate, cell: (s) => formatDate(s.startDate) },
    { key: "end", header: "End Date", sortValue: (s) => s.endDate, cell: (s) => formatDate(s.endDate) },
    { key: "status", header: "Status", sortValue: (s) => s.status, cell: (s) => <StatusBadge status={s.status} /> },
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

      <SummaryCards
        items={[
          { iconName: "FileText", value: all.length, label: "Total Subscription", color: "blue" },
          { iconName: "UserCheck", value: all.filter((s) => s.status === "Active").length, label: "Active", color: "green" },
          { iconName: "CreditCard", value: formatCurrency(totalValue), label: "Total Nilai", color: "red" },
        ]}
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search subscription..."
          ariaLabel="Search subscription"
          className="flex-1"
        />
        <FilterSelect
          value={chapterFilter}
          onChange={setChapterFilter}
          ariaLabel="Filter by chapter"
          options={chapterFilterOptions((memberData ?? []).map((m) => m.chapter))}
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
