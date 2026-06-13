/**
 * BNI memberships are term-based (1 / 2 / 5 years), not "Basic/Premium" tiers.
 * This maps a member's duration (in months) to its package term label.
 */

/** The package term a member's duration maps to (used as member.subscription). */
export function packageNameForDuration(durationMonths: number): string {
  if (durationMonths >= 60) return "5 Tahun";
  if (durationMonths >= 24) return "2 Tahun";
  return "1 Tahun";
}
