/**
 * Domain entity: a member subscription.
 */
export type SubscriptionStatus = "Active" | "Pending" | "Expired";

export interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  /** Subscription plan, e.g. "Basic" or "Premium". */
  plan: string;
  amount: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}
