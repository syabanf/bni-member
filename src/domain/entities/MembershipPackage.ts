/**
 * Domain entity: a BNI membership package. BNI memberships are term-based
 * (1 / 2 / 5 years) with a one-time registration fee plus annual dues; longer
 * terms are discounted. (There are no "Basic/Premium" tiers.)
 */
export interface MembershipPackage {
  id: string;
  name: string;
  /** Short term label, e.g. "1 Tahun". */
  term: string;
  durationMonths: number;
  /** One-time registration / application fee. */
  registrationFee: number;
  /** Annual membership dues. */
  annualFee: number;
  /** Total price for the whole term (after multi-year discount). */
  total: number;
  features: string[];
  recommended?: boolean;
}

/** The package term a member's duration maps to (used as member.subscription). */
export function packageNameForDuration(durationMonths: number): string {
  if (durationMonths >= 60) return "5 Tahun";
  if (durationMonths >= 24) return "2 Tahun";
  return "1 Tahun";
}
