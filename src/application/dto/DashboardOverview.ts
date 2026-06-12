import type {
  PaymentRecord,
  PaymentSummary,
  PaymentDistributionSlice,
} from "@/domain/entities/Payment";

/** Aggregated payload for the dashboard landing page. */
export interface DashboardOverview {
  summary: PaymentSummary;
  distribution: PaymentDistributionSlice[];
  recentPayments: PaymentRecord[];
}
