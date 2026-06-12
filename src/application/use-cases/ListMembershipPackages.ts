import type { MembershipPackageRepository } from "@/domain/repositories/MembershipPackageRepository";
import type { MembershipPackage } from "@/domain/entities/MembershipPackage";

/** Returns the available membership packages. */
export class ListMembershipPackages {
  constructor(private readonly packages: MembershipPackageRepository) {}

  execute(): Promise<MembershipPackage[]> {
    return this.packages.getAll();
  }
}
