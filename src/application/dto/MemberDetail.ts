import type { Member } from "@/domain/entities/Member";

export interface MemberDetail {
  member: Member;
  chapterName: string;
  cityName: string;
  /** City id for drill-down (null if the chapter/city is missing). */
  cityId: string | null;
  /** The member who invited/sponsored this member, if any. */
  sponsor: Member | null;
  /** Members this member has invited (referral downline). */
  sponsored: Member[];
  renewalDate: string | null;
}
