/**
 * Domain entity: a BNI referral "slip" — one member passing a business
 * opportunity to another. The closed value is tracked as TYFCB.
 */
export type ReferralStatus = "Open" | "In Progress" | "Closed" | "Cancelled";

/** RGI (inside the chapter) vs RGO (outside the chapter / Tier 2+). */
export type ReferralTier = "Inside" | "Outside";

export interface Referral {
  id: string;
  fromMemberId: string; // giver
  toMemberId: string; // receiver
  date: string;
  description: string;
  tier: ReferralTier;
  status: ReferralStatus;
  /** Thank You For Closed Business — closed value in IDR (0 until closed). */
  tyfcb: number;
}
