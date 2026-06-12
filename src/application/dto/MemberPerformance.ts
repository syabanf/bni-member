/** PALMS-style performance snapshot for a member. */
export interface MemberPerformance {
  referralsGiven: number;
  referralsReceived: number;
  /** Money made: sum of closed referrals received (IDR). */
  tyfcb: number;
  oneToOnes: number;
  visitorsBrought: number;
  ceu: number;
  attendancePercent: number;
}
