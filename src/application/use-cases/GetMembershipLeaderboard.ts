import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ReferralRepository } from "@/domain/repositories/ReferralRepository";
import type { VisitorRepository } from "@/domain/repositories/VisitorRepository";
import type { LeaderboardEntry } from "../dto/LeaderboardEntry";

/** Ranks members by closed TYFCB (then referrals given) for the leaderboard. */
export class GetMembershipLeaderboard {
  constructor(
    private readonly members: MemberRepository,
    private readonly referrals: ReferralRepository,
    private readonly visitors: VisitorRepository,
  ) {}

  async execute(): Promise<LeaderboardEntry[]> {
    const [members, refs, visitors] = await Promise.all([
      this.members.getAll(),
      this.referrals.getAll(),
      this.visitors.getAll(),
    ]);

    return members
      .map((member) => {
        const received = refs.filter((r) => r.toMemberId === member.id);
        return {
          member,
          referralsGiven: refs.filter((r) => r.fromMemberId === member.id).length,
          referralsReceived: received.length,
          tyfcb: received
            .filter((r) => r.status === "Closed")
            .reduce((sum, r) => sum + r.tyfcb, 0),
          visitorsBrought: visitors.filter((v) => v.invitedById === member.id).length,
        };
      })
      .sort((a, b) => b.tyfcb - a.tyfcb || b.referralsGiven - a.referralsGiven);
  }
}
