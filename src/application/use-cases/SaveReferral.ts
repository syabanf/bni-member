import type { ReferralRepository } from "@/domain/repositories/ReferralRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type {
  Referral,
  ReferralStatus,
  ReferralTier,
} from "@/domain/entities/Referral";

export interface SaveReferralInput {
  id?: string;
  fromMemberId: string;
  toMemberId: string;
  date: string;
  description: string;
  tier: ReferralTier;
  status: ReferralStatus;
  tyfcb: number;
}

/** Creates or updates a referral; validates the members and TYFCB. */
export class SaveReferral {
  constructor(
    private readonly referrals: ReferralRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(input: SaveReferralInput): Promise<Referral> {
    if (input.fromMemberId === input.toMemberId) {
      throw new Error("Pemberi dan penerima referral tidak boleh sama");
    }
    const [from, to] = await Promise.all([
      this.members.getById(input.fromMemberId),
      this.members.getById(input.toMemberId),
    ]);
    if (!from || !to) throw new Error("Member pemberi/penerima tidak valid");

    const { id, ...rest } = input;
    // TYFCB only counts once the referral is closed.
    const data: Omit<Referral, "id"> = {
      ...rest,
      tyfcb: rest.status === "Closed" ? rest.tyfcb : 0,
    };
    return id ? this.referrals.update(id, data) : this.referrals.create(data);
  }
}
