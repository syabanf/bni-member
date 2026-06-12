import type { MembershipPackageRepository } from "@/domain/repositories/MembershipPackageRepository";
import type { MembershipPackage } from "@/domain/entities/MembershipPackage";
import { packagesSeed } from "../data/packages.data";

/** In-memory adapter for {@link MembershipPackageRepository}. */
export class InMemoryMembershipPackageRepository implements MembershipPackageRepository {
  constructor(private readonly packages: MembershipPackage[] = packagesSeed) {}

  async getAll(): Promise<MembershipPackage[]> {
    return this.packages.map((p) => ({ ...p }));
  }
}
