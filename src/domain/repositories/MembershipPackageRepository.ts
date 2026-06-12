import type { MembershipPackage } from "../entities/MembershipPackage";

/** Port (interface) for membership-package reference data. */
export interface MembershipPackageRepository {
  getAll(): Promise<MembershipPackage[]>;
}
