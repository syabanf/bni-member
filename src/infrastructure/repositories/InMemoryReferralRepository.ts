import type { ReferralRepository } from "@/domain/repositories/ReferralRepository";
import type { Referral } from "@/domain/entities/Referral";
import { referralsSeed } from "../data/referrals.data";

/** In-memory adapter for {@link ReferralRepository}. */
export class InMemoryReferralRepository implements ReferralRepository {
  private items: Referral[];

  constructor(seed: Referral[] = referralsSeed) {
    this.items = seed.map((r) => ({ ...r }));
  }

  async getAll(): Promise<Referral[]> {
    return this.items.map((r) => ({ ...r }));
  }

  async create(input: Omit<Referral, "id">): Promise<Referral> {
    const item: Referral = { id: crypto.randomUUID(), ...input };
    this.items.push(item);
    return { ...item };
  }

  async update(id: string, input: Omit<Referral, "id">): Promise<Referral> {
    const index = this.items.findIndex((r) => r.id === id);
    if (index < 0) throw new Error("Referral tidak ditemukan");
    this.items[index] = { id, ...input };
    return { ...this.items[index] };
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((r) => r.id !== id);
  }
}
