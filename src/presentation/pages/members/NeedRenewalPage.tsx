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

export function NeedRenewalPage() {
  const { getMembersByStatus } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);
  const { data } = useAsync(() => getMembersByStatus.execute(["Active", "Pending"]), [refresh]);
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
      <PageHeader title="Members Need Renewal" />

      <SummaryCards
        items={[
          { iconName: "Timer", value: all.length, label: "Perlu Renewal", color: "amber" },
          { iconName: "UserCheck", value: all.filter((m) => m.status === "Active").length, label: "Active", color: "green" },
          { iconName: "Clock", value: all.filter((m) => m.status === "Pending").length, label: "Pending", color: "blue" },
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
        emptyText="No members need renewal"
        extraColumns={[
          {
            header: "Renewal Status",
            render: () => (
              <span className="px-3 py-1 text-xs bg-warning/10 text-warning rounded-full">
                Needs Renewal
              </span>
            ),
          },
        ]}
        renderActions={(m) => (
          <div className="flex gap-2">
            <button
              onClick={() => actions.setStatus(m, "Active", "diperpanjang & diaktifkan")}
              className="flex-1 md:flex-none px-3 py-1 text-xs rounded-lg bg-bni-primary/10 text-bni-primary hover:bg-bni-primary/20 font-medium"
            >
              Renew
            </button>
            <button
              onClick={() => actions.openDetail(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              View
            </button>
            <button
              onClick={() => actions.openEdit(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>
        )}
      />

      {actions.modals}
    </div>
  );
}
