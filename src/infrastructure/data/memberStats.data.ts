/**
 * PALMS stats that are not derivable from other data (1-2-1, CEU, attendance),
 * keyed by member id. Merged into members by the member repository.
 */
export const memberStatsSeed: Record<
  string,
  { oneToOnes: number; ceu: number; attendancePercent: number }
> = {
  m001: { oneToOnes: 18, ceu: 24, attendancePercent: 96 },
  m002: { oneToOnes: 15, ceu: 20, attendancePercent: 94 },
  m003: { oneToOnes: 14, ceu: 18, attendancePercent: 91 },
  m004: { oneToOnes: 17, ceu: 22, attendancePercent: 95 },
  m005: { oneToOnes: 10, ceu: 13, attendancePercent: 84 },
  m006: { oneToOnes: 12, ceu: 16, attendancePercent: 92 },
  m007: { oneToOnes: 6, ceu: 8, attendancePercent: 70 },
  m008: { oneToOnes: 10, ceu: 12, attendancePercent: 89 },
  m009: { oneToOnes: 9, ceu: 11, attendancePercent: 85 },
  m010: { oneToOnes: 12, ceu: 15, attendancePercent: 90 },
  m011: { oneToOnes: 9, ceu: 12, attendancePercent: 88 },
  m012: { oneToOnes: 8, ceu: 10, attendancePercent: 82 },
  m013: { oneToOnes: 13, ceu: 16, attendancePercent: 93 },
  m014: { oneToOnes: 3, ceu: 5, attendancePercent: 72 },
  m015: { oneToOnes: 11, ceu: 14, attendancePercent: 92 },
  m016: { oneToOnes: 4, ceu: 6, attendancePercent: 78 },
  m017: { oneToOnes: 11, ceu: 14, attendancePercent: 90 },
  m018: { oneToOnes: 5, ceu: 8, attendancePercent: 80 },
  m019: { oneToOnes: 7, ceu: 9, attendancePercent: 83 },
  m020: { oneToOnes: 6, ceu: 9, attendancePercent: 81 },
};
