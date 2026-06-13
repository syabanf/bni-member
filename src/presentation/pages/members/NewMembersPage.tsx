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

export function NewMembersPage() {
  const { getMembersByStatus } = useServices();
  const { data } = useAsync(() => getMembersByStatus.execute(["Pending"]), []);
  const all = data ?? [];
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
          <button className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
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
        renderActions={() => (
          <div className="flex gap-2">
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Approve
            </button>
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Edit
            </button>
          </div>
        )}
      />
    </div>
  );
}
