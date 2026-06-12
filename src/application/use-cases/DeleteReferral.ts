import type { ReferralRepository } from "@/domain/repositories/ReferralRepository";

export class DeleteReferral {
  constructor(private readonly referrals: ReferralRepository) {}

  execute(id: string): Promise<void> {
    return this.referrals.delete(id);
  }
}
