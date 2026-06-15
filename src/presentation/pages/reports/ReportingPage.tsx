import { Download } from "lucide-react";
import type { PaymentRecord } from "@/domain/entities/Payment";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { useToast } from "@/presentation/providers/ToastProvider";
import { exportToCsv } from "@/presentation/utils/csv";
import { formatCurrency } from "@/presentation/utils/format";

function BarRow({
  label,
  value,
  max,
  display,
  barColor,
}: {
  label: string;
  value: number;
  max: number;
  display?: string;
  barColor?: string;
}) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900 tabular-nums">{display ?? value}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full ${barColor ? "" : "bg-bni-primary"}`}
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
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
  const { getDashboardOverview, getPaymentsByCategory } = useServices();
  const toast = useToast();

  const { data: overview } = useAsync(() => getDashboardOverview.execute(50), []);
  const { data: outstanding } = useAsync(() => getPaymentsByCategory.execute("outstanding"), []);
  const { data: overdue } = useAsync(() => getPaymentsByCategory.execute("overdue"), []);

  const summary = overview?.summary;
  const distribution = overview?.distribution ?? [];
  const maxDist = Math.max(1, ...distribution.map((d) => d.value));

  // Arrears = outstanding + overdue records (deduped by id).
  const arrearsMap = new Map<string, PaymentRecord>();
  [...(outstanding ?? []), ...(overdue ?? [])].forEach((r) => arrearsMap.set(r.id, r));
  const arrears = Array.from(arrearsMap.values());
  const totalArrears = arrears.reduce((s, r) => s + (r.amount ?? 0), 0);

  const byChapter = new Map<string, number>();
  arrears.forEach((r) => byChapter.set(r.chapter, (byChapter.get(r.chapter) ?? 0) + (r.amount ?? 0)));
  const chapterRows = Array.from(byChapter.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const maxChapter = Math.max(1, ...chapterRows.map((r) => r.value));

  const handleExport = () => {
    exportToCsv("laporan-tunggakan.csv", arrears, [
      { header: "Member", value: (r) => r.memberName },
      { header: "Chapter", value: (r) => r.chapter },
      { header: "Status", value: (r) => r.paymentStatus },
      { header: "Nominal", value: (r) => r.amount ?? 0 },
      { header: "Tanggal", value: (r) => r.date },
    ]);
    toast("Laporan tunggakan diekspor ke CSV");
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="BNI Indonesia"
        title="Laporan Pembayaran"
        description="Ringkasan status pembayaran iuran: tagihan outstanding, awaiting, renewal, overdue, dan tunggakan per chapter."
        actions={
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export Tunggakan
          </button>
        }
      />

      <SummaryCards
        items={[
          { iconName: "CreditCard", value: summary?.outstanding ?? 0, label: "Outstanding", color: "red" },
          { iconName: "Clock", value: summary?.awaiting ?? 0, label: "Awaiting", color: "amber" },
          { iconName: "RefreshCw", value: summary?.renewal ?? 0, label: "Renewal Bulan Ini", color: "blue" },
          { iconName: "AlertTriangle", value: summary?.overdue ?? 0, label: "Overdue", color: "red" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportCard title="Distribusi Status Pembayaran">
          {distribution.length ? (
            distribution.map((d) => (
              <BarRow key={d.name} label={d.name} value={d.value} max={maxDist} barColor={d.color} />
            ))
          ) : (
            <p className="text-sm text-gray-400">Belum ada data.</p>
          )}
        </ReportCard>

        <ReportCard title={`Tunggakan per Chapter · ${formatCurrency(totalArrears)}`}>
          {chapterRows.length ? (
            chapterRows.map((r) => (
              <BarRow key={r.name} label={r.name} value={r.value} max={maxChapter} display={formatCurrency(r.value)} />
            ))
          ) : (
            <p className="text-sm text-gray-400">Tidak ada tunggakan 🎉</p>
          )}
        </ReportCard>
      </div>

      <p className="text-sm text-gray-500">
        Total tagihan tertunggak: <span className="font-semibold text-gray-900">{arrears.length}</span> · Nilai:{" "}
        <span className="font-semibold text-gray-900">{formatCurrency(totalArrears)}</span>
      </p>
    </div>
  );
}
