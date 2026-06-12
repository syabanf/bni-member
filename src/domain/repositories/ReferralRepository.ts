import type { Referral } from "../entities/Referral";

/** Port (interface) for referral-slip persistence with CRUD. */
export interface ReferralRepository {
  getAll(): Promise<Referral[]>;
  create(input: Omit<Referral, "id">): Promise<Referral>;
  update(id: string, input: Omit<Referral, "id">): Promise<Referral>;
  delete(id: string): Promise<void>;
}
