import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ReferralRepository } from "@/domain/repositories/ReferralRepository";
import type { VisitorRepository } from "@/domain/repositories/VisitorRepository";
import type { MemberPerformance } from "../dto/MemberPerformance";

/**
 * Builds a member's PALMS snapshot: referrals & TYFCB are derived from the
 * referral data, visitors from the visitor data, and 1-2-1 / CEU / attendance
 * come from the member's stored stats.
 */
export class GetMemberPerformance {
  constructor(
    private readonly members: MemberRepository,
    private readonly referrals: ReferralRepository,
    private readonly visitors: VisitorRepository,
  ) {}

  async execute(memberId: string): Promise<MemberPerformance> {
    const [member, refs, visitors] = await Promise.all([
      this.members.getById(memberId),
      this.referrals.getAll(),
      this.visitors.getAll(),
    ]);
    if (!member) throw new Error("Member tidak ditemukan");

    const received = refs.filter((r) => r.toMemberId === memberId);
    const tyfcb = received
      .filter((r) => r.status === "Closed")
      .reduce((sum, r) => sum + r.tyfcb, 0);

    return {
      referralsGiven: refs.filter((r) => r.fromMemberId === memberId).length,
      referralsReceived: received.length,
      tyfcb,
      oneToOnes: member.oneToOnes ?? 0,
      visitorsBrought: visitors.filter((v) => v.invitedById === memberId).length,
      ceu: member.ceu ?? 0,
      attendancePercent: member.attendancePercent ?? 0,
    };
  }
}
