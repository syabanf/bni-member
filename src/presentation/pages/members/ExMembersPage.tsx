import { useState } from "react";
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

export function ExMembersPage() {
  const { getMembersByStatus } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);
  const { data } = useAsync(() => getMembersByStatus.execute(["Expired"]), [refresh]);
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
      <PageHeader title="Ex-Member" />

      <SummaryCards
        items={[
          { iconName: "UserMinus", value: all.length, label: "Ex-Member", color: "red" },
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
        avatar="muted"
        emptyText="No ex-members found"
        renderActions={(m) => (
          <div className="flex gap-2">
            <button
              onClick={() => actions.setStatus(m, "Active", "dipulihkan & diaktifkan")}
              className="flex-1 md:flex-none px-3 py-1 text-xs rounded-lg bg-success/10 text-success hover:bg-success/20 font-medium"
            >
              Restore
            </button>
            <button
              onClick={() => actions.openDetail(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              View
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
