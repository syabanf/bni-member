import type { MemberStatus } from "./Member";

/**
 * Domain entity: a payment record and its supporting value objects.
 */
export type PaymentStatus = "Paid" | "Outstanding" | "Awaiting" | "Overdue";

/** The four payment "buckets" surfaced in the Payment menu. */
export type PaymentCategory = "outstanding" | "awaiting" | "renewal" | "overdue";

export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  email?: string;
  chapter: string;
  status: MemberStatus;
  paymentStatus: PaymentStatus;
  date: string;
  amount?: number;
}

/** Headline counters shown on the dashboard / stat cards. */
export interface PaymentSummary {
  outstanding: number;
  awaiting: number;
  renewal: number;
  overdue: number;
}

/** A single slice of the payment-status donut chart. */
export interface PaymentDistributionSlice {
  name: string;
  value: number;
  color: string;
}
