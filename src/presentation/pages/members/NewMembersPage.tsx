import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { MembersTable } from "@/presentation/components/members/MembersTable";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";
import { useMemberActions } from "@/presentation/hooks/useMemberActions";

export function NewMembersPage() {
  const { getMembersByStatus } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);
  const { data } = useAsync(() => getMembersByStatus.execute(["Pending"]), [refresh]);
  const all = data ?? [];
  const actions = useMemberActions(bump);
  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState(ALL);
  const q = search.toLowerCase();
  const rows = all.filter(
    (m) =>
      (chapter === ALL || m.chapter === chapter) &&
      (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Member"
        actions={
          <button
            onClick={actions.openCreate}
            className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add New Member
          </button>
        }
      />

      <SummaryCards
        items={[
          { iconName: "UserPlus", value: all.length, label: "Pengajuan Baru", color: "amber" },
          { iconName: "Timer", value: all.filter((m) => m.durationMonths >= 24).length, label: "Multi-tahun", color: "blue" },
          { iconName: "Clock", value: all.filter((m) => m.durationMonths === 12).length, label: "1 Tahun", color: "green" },
        ]}
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama atau email..."
          ariaLabel="Cari member"
          className="flex-1"
        />
        <FilterSelect
          value={chapter}
          onChange={setChapter}
          ariaLabel="Filter by chapter"
          options={chapterFilterOptions(all.map((m) => m.chapter))}
        />
      </FilterBar>

      <MembersTable
        members={rows}
        emptyText="No new members found"
        renderActions={(m) => (
          <div className="flex gap-2">
            <button
              onClick={() => actions.setStatus(m, "Active", "disetujui & diaktifkan")}
              className="flex-1 md:flex-none px-3 py-1 text-xs rounded-lg bg-success/10 text-success hover:bg-success/20 font-medium"
            >
              Approve
            </button>
            <button
              onClick={() => actions.openEdit(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => actions.askDelete(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-danger hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      />

      {actions.modals}
    </div>
  );
}
