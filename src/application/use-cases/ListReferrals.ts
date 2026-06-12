import type { ReferralRepository } from "@/domain/repositories/ReferralRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ReferralWithNames } from "../dto/ReferralWithNames";

/** Lists referrals enriched with the giver and receiver names. */
export class ListReferrals {
  constructor(
    private readonly referrals: ReferralRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(): Promise<ReferralWithNames[]> {
    const [refs, members] = await Promise.all([
      this.referrals.getAll(),
      this.members.getAll(),
    ]);
    const name = new Map(members.map((m) => [m.id, m.name]));
    return refs
      .map((referral) => ({
        referral,
        fromName: name.get(referral.fromMemberId) ?? "—",
        toName: name.get(referral.toMemberId) ?? "—",
      }))
      .sort((a, b) => b.referral.date.localeCompare(a.referral.date));
  }
}
