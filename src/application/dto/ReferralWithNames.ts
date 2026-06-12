import type { Referral } from "@/domain/entities/Referral";

export interface ReferralWithNames {
  referral: Referral;
  fromName: string;
  toName: string;
}
