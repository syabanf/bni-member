import { useState } from "react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { MembersTable } from "@/presentation/components/members/MembersTable";

export function NeedRenewalPage() {
  const { getMembersByStatus } = useServices();
  const { data } = useAsync(() => getMembersByStatus.execute(["Active", "Pending"]), []);
  const all = data ?? [];
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();
  const rows = all.filter(
    (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
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
      />
    </div>
  );
}
