import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { MemberTable } from "@/presentation/components/dashboard/MemberTable";

const PaymentDonutChart = lazy(
  () => import("@/presentation/components/dashboard/PaymentDonutChart"),
);

/** Donut slice -> drill-down destination. */
const SLICE_ROUTE: Record<string, string> = {
  Outstanding: "/payments/outstanding",
  Awaiting: "/payments/awaiting",
  Overdue: "/payments/overdue",
  Paid: "/members",
};

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100/80 h-full min-h-[20rem] animate-pulse" />
  );
}

export function DashboardPage() {
  const { getDashboardOverview } = useServices();
  const navigate = useNavigate();
  const { data } = useAsync(() => getDashboardOverview.execute(6), []);

  const summary = data?.summary;
  const distribution = data?.distribution ?? [];
  const recentPayments = data?.recentPayments ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          iconName="CreditCard"
          value={summary?.outstanding ?? "—"}
          label="Outstanding"
          trend="+12%"
          trendDirection="up"
          color="red"
          to="/payments/outstanding"
        />
        <StatCard
          iconName="Clock"
          value={summary?.awaiting ?? "—"}
          label="Awaiting Confirmation"
          trend="-5%"
          trendDirection="down"
          color="amber"
          to="/payments/awaiting"
        />
        <StatCard
          iconName="RefreshCw"
          value={summary?.renewal ?? "—"}
          label="Renewal This Month"
          trend="0%"
          trendDirection="neutral"
          color="blue"
          to="/payments/renewal"
        />
        <StatCard
          iconName="AlertTriangle"
          value={summary?.overdue ?? "—"}
          label="Overdue"
          trend="+3"
          trendDirection="up"
          color="red"
          to="/payments/overdue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <MemberTable data={recentPayments} title="Recent Member Activity" viewAllTo="/members" />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <PaymentDonutChart
              data={distribution}
              onSliceClick={(name) => {
                const route = SLICE_ROUTE[name];
                if (route) navigate(route);
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
