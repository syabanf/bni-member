/**
 * Domain entity: a BNI member.
 * Pure data + types — no framework dependencies.
 */
export type MemberStatus = "Active" | "Pending" | "Overdue" | "Expired";

export type SubscriptionTier = "Basic" | "Premium";

export interface Member {
  id: string;
  name: string;
  email: string;
  chapter: string;
  joinDate: string;
  status: MemberStatus;
  subscription: SubscriptionTier | string;
  avatar?: string;
}
