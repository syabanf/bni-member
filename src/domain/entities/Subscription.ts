/**
 * Domain entity: a member subscription.
 */
export type SubscriptionStatus = "Active" | "Pending" | "Expired";

export interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  /** Membership package term, e.g. "1 Tahun" / "2 Tahun" / "5 Tahun". */
  plan: string;
  amount: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}
