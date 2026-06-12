import { useState } from "react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { MembersTable } from "@/presentation/components/members/MembersTable";

export function ExMembersPage() {
  const { getMembersByStatus } = useServices();
  const { data } = useAsync(() => getMembersByStatus.execute(["Expired"]), []);
  const all = data ?? [];
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();
  const rows = all.filter(
    (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Ex-Member" />

      <SummaryCards
        items={[
          { iconName: "UserMinus", value: all.length, label: "Ex-Member", color: "red" },
          { iconName: "CreditCard", value: all.filter((m) => m.subscription === "Premium").length, label: "Premium", color: "blue" },
          { iconName: "FileText", value: all.filter((m) => m.subscription === "Basic").length, label: "Basic", color: "green" },
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
        avatar="muted"
        emptyText="No ex-members found"
        renderActions={() => (
          <div className="flex gap-2">
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Restore
            </button>
            <button className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              View
            </button>
          </div>
        )}
      />
    </div>
  );
}
