import { Download } from "lucide-react";
import { VISITOR_STAGES } from "@/domain/entities/Visitor";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { useToast } from "@/presentation/providers/ToastProvider";
import { exportToCsv } from "@/presentation/utils/csv";
import { formatCurrency } from "@/presentation/utils/format";
import { countUniqueVisitors } from "@/presentation/utils/visitors";

function BarRow({ label, value, max, display }: { label: string; value: number; max: number; display?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900 tabular-nums">{display ?? value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-bni-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100/80 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function ReportingPage() {
  const { getMembers, listChapters, listCities, getMembershipLeaderboard, getSubscriptions, listVisitors } =
    useServices();
  const toast = useToast();

  const { data: members } = useAsync(() => getMembers.execute({}), []);
  const { data: chapterStats } = useAsync(() => listChapters.execute(), []);
  const { data: cityStats } = useAsync(() => listCities.execute(), []);
  const { data: leaderboard } = useAsync(() => getMembershipLeaderboard.execute(), []);
  const { data: subscriptions } = useAsync(() => getSubscriptions.execute(""), []);
  const { data: visitors } = useAsync(() => listVisitors.execute(), []);

  const memberList = members ?? [];
  const chapters = chapterStats ?? [];
  const board = leaderboard ?? [];
  const subs = subscriptions ?? [];
  const vis = visitors ?? [];

  const totalTyfcb = board.reduce((s, e) => s + e.tyfcb, 0);
  const totalRevenue = subs.reduce((s, x) => s + x.amount, 0);

  // Members per chapter (sorted desc)
  const perChapter = [...chapters]
    .map((c) => ({ name: c.chapter.name, count: c.memberCount }))
    .sort((a, b) => b.count - a.count);
  const maxChapter = Math.max(1, ...perChapter.map((c) => c.count));

  // Status breakdown
  const statuses = ["Active", "Pending", "Overdue", "Expired"] as const;
  const statusCounts = statuses.map((s) => ({ s, n: memberList.filter((m) => m.status === s).length }));
  const maxStatus = Math.max(1, ...statusCounts.map((x) => x.n));

  // Visitor funnel
  const funnel = VISITOR_STAGES.map((stage) => ({ stage, n: vis.filter((v) => v.visitor.status === stage).length }));
  const maxFunnel = Math.max(1, ...funnel.map((x) => x.n));
  const uniqueVisitors = countUniqueVisitors(vis.map((v) => v.visitor));

  // TYFCB per chapter (top 6)
  const tyfcbByChapter = new Map<string, number>();
  board.forEach((e) => tyfcbByChapter.set(e.member.chapter, (tyfcbByChapter.get(e.member.chapter) ?? 0) + e.tyfcb));
  const tyfcbRows = Array.from(tyfcbByChapter.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const maxTyfcb = Math.max(1, ...tyfcbRows.map((r) => r.value));

  const handleExport = () => {
    exportToCsv("laporan-chapter.csv", chapters, [
      { header: "Chapter", value: (c) => c.chapter.name },
      { header: "Kota", value: (c) => c.cityName },
      { header: "Member", value: (c) => c.memberCount },
      { header: "Status", value: (c) => c.chapter.status },
      { header: "TYFCB", value: (c) => tyfcbByChapter.get(c.chapter.name) ?? 0 },
    ]);
    toast("Laporan chapter diekspor ke CSV");
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="BNI Indonesia"
        title="Laporan"
        description="Ringkasan performa keanggotaan, distribusi member, funnel visitor, dan nilai bisnis (TYFCB)."
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <SummaryCards
        items={[
          { iconName: "Users", value: memberList.length, label: "Total Member", color: "blue" },
          { iconName: "Building2", value: chapters.length, label: "Total Chapter", color: "amber" },
          { iconName: "MapPin", value: (cityStats ?? []).length, label: "Total Kota", color: "green" },
          { iconName: "CreditCard", value: formatCurrency(totalTyfcb), label: "Total TYFCB", color: "red" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportCard title="Member per Chapter">
          {perChapter.length ? (
            perChapter.map((c) => <BarRow key={c.name} label={c.name} value={c.count} max={maxChapter} />)
          ) : (
            <p className="text-sm text-gray-400">Belum ada data.</p>
          )}
        </ReportCard>

        <ReportCard title="Status Member">
          {statusCounts.map((x) => (
            <BarRow key={x.s} label={x.s} value={x.n} max={maxStatus} />
          ))}
        </ReportCard>

        <ReportCard title={`Funnel Visitor · ${uniqueVisitors} unik (phone/email)`}>
          {funnel.map((x) => (
            <BarRow key={x.stage} label={x.stage} value={x.n} max={maxFunnel} />
          ))}
        </ReportCard>

        <ReportCard title="TYFCB per Chapter (Top 6)">
          {tyfcbRows.length ? (
            tyfcbRows.map((r) => (
              <BarRow key={r.name} label={r.name} value={r.value} max={maxTyfcb} display={formatCurrency(r.value)} />
            ))
          ) : (
            <p className="text-sm text-gray-400">Belum ada data.</p>
          )}
        </ReportCard>
      </div>

      <p className="text-sm text-gray-500">
        Total nilai langganan tercatat: <span className="font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
      </p>
    </div>
  );
}
