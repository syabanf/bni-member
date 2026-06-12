import type { Member } from "@/domain/entities/Member";

export interface MemberDetail {
  member: Member;
  chapterName: string;
  cityName: string;
  /** The member who invited/sponsored this member, if any. */
  sponsor: Member | null;
  /** Members this member has invited (referral downline). */
  sponsored: Member[];
  renewalDate: string | null;
}
