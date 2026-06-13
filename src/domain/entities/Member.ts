/**
 * Domain entity: a BNI member. Belongs to one chapter, holds a unique
 * professional classification within that chapter, and may have been invited
 * (sponsored / referred) by another member.
 */
export type MemberStatus = "Active" | "Pending" | "Overdue" | "Expired";

export type MemberRole =
  | "President"
  | "Vice President"
  | "Secretary/Treasurer"
  | "Member";

/** Standard BNI membership terms, in months. */
export const MEMBERSHIP_DURATIONS = [12, 24, 60] as const;

export interface Member {
  id: string;
  name: string;
  email: string;
  /** Mobile number (Indonesian format, e.g. "08123456789") for WhatsApp reminders. */
  phone?: string;
  /** Denormalised chapter name (for display); source of truth is chapterId. */
  chapter: string;
  chapterId: string; // FK -> Chapter
  /** Profession; unique within a chapter (BNI "one seat per profession" rule). */
  classification: string;
  role: MemberRole;
  status: MemberStatus;
  /** Membership package term, e.g. "1 Tahun" / "2 Tahun" / "5 Tahun" (derived from durationMonths). */
  subscription: string;
  joinDate: string;
  /** Membership term in months (12 / 24 / 60). */
  durationMonths: number;
  /** One-time registration / application fee. */
  registrationFee: number;
  /** Recurring (annual) membership fee. */
  membershipFee: number;
  /** Member who invited/sponsored this member (FK -> Member). */
  sponsorId?: string;
  avatar?: string;
  // PALMS performance stats that are not derivable from other data.
  /** Recorded one-to-one meetings. */
  oneToOnes?: number;
  /** Continuing Education Units (training completed). */
  ceu?: number;
  /** Attendance percentage (0-100). */
  attendancePercent?: number;
}

/** Renewal date = joinDate + durationMonths. Returns ISO yyyy-mm-dd. */
export function memberRenewalDate(
  member: Pick<Member, "joinDate" | "durationMonths">,
): string | null {
  if (!member.durationMonths) return null;
  const d = new Date(member.joinDate);
  d.setMonth(d.getMonth() + member.durationMonths);
  return d.toISOString().slice(0, 10);
}
