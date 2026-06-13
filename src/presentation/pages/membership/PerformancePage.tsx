import { useState } from "react";
import { RefreshCw } from "lucide-react";
import type { LeaderboardEntry } from "@/application/dto/LeaderboardEntry";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { formatCurrency } from "@/presentation/utils/format";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";

const ghostBtn =
  "flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium";

type Ranked = LeaderboardEntry & { rank: number };

const rankClass = (rank: number) =>
  rank === 1
    ? "bg-warning/15 text-warning"
    : rank === 2
      ? "bg-gray-200 text-gray-600"
      : rank === 3
        ? "bg-bni-primary/10 text-bni-primary"
        : "bg-gray-100 text-gray-500";

export function PerformancePage() {
  const { getMembershipLeaderboard } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);

  const { data } = useAsync(() => getMembershipLeaderboard.execute(), [refresh]);
  const list = data ?? [];
  const ranked: Ranked[] = list.map((e, i) => ({ ...e, rank: i + 1 }));
  const [search, setSearch] = useState("");
  const [chapterFilter, setChapterFilter] = useState(ALL);
  const q = search.toLowerCase();
  const rows = ranked.filter(
    (e) =>
      (chapterFilter === ALL || e.member.chapter === chapterFilter) &&
      e.member.name.toLowerCase().includes(q),
  );
  const totalTyfcb = list.reduce((s, e) => s + e.tyfcb, 0);
  const totalReferral = list.reduce((s, e) => s + e.referralsGiven, 0);
  const totalVisitor = list.reduce((s, e) => s + e.visitorsBrought, 0);

  const columns: Column<Ranked>[] = [
    {
      key: "rank",
      header: "#",
      sortValue: (e) => e.rank,
      cell: (e) => (
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${rankClass(e.rank)}`}>
          {e.rank}
        </span>
      ),
    },
    {
      key: "member",
      header: "Member",
      primary: true,
      sortValue: (e) => e.member.name,
      cell: (e) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{e.member.name}</p>
          <p className="text-xs text-gray-500">{e.member.chapter}</p>
        </div>
      ),
    },
    { key: "given", header: "Referral Given", sortValue: (e) => e.referralsGiven, cell: (e) => e.referralsGiven },
    { key: "received", header: "Referral Received", sortValue: (e) => e.referralsReceived, cell: (e) => e.referralsReceived },
    { key: "visitor", header: "Visitor", sortValue: (e) => e.visitorsBrought, cell: (e) => e.visitorsBrought },
    {
      key: "tyfcb",
      header: "TYFCB",
      align: "right",
      sortValue: (e) => e.tyfcb,
      cell: (e) => <span className="font-medium text-gray-900">{formatCurrency(e.tyfcb)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="BNI Indonesia"
        title="Performa Keanggotaan"
        description="Peringkat member berdasarkan TYFCB (closed business) & referral — ringkasan metrik PALMS."
        actions={
          <button onClick={bump} className={ghostBtn}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        }
      />

      <SummaryCards
        items={[
          { iconName: "CreditCard", value: formatCurrency(totalTyfcb), label: "Total TYFCB", color: "green" },
          { iconName: "Share2", value: totalReferral, label: "Total Referral", color: "blue" },
          { iconName: "DoorOpen", value: totalVisitor, label: "Total Visitor", color: "amber" },
        ]}
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari member..."
          ariaLabel="Cari member"
          className="flex-1"
        />
        <FilterSelect
          value={chapterFilter}
          onChange={setChapterFilter}
          ariaLabel="Filter by chapter"
          options={chapterFilterOptions(list.map((e) => e.member.chapter))}
        />
      </FilterBar>

      <DataTable columns={columns} rows={rows} rowKey={(e) => e.member.id} emptyText="Belum ada data performa" />
    </div>
  );
}
