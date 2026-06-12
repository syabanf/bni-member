import type {
  PaymentRecord,
  PaymentSummary,
  PaymentDistributionSlice,
} from "../entities/Payment";

/**
 * Port (interface) for payment data access.
 */
export interface PaymentRepository {
  getAll(): Promise<PaymentRecord[]>;
  /** Most recent N payment records, for the dashboard activity table. */
  getRecent(limit: number): Promise<PaymentRecord[]>;
  /** Headline counters (may be a server-side aggregate, not derived from getAll). */
  getSummary(): Promise<PaymentSummary>;
  /** Slices for the payment-status donut chart. */
  getDistribution(): Promise<PaymentDistributionSlice[]>;
}
