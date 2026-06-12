import type { Member } from "@/domain/entities/Member";

export interface LeaderboardEntry {
  member: Member;
  referralsGiven: number;
  referralsReceived: number;
  tyfcb: number;
  visitorsBrought: number;
}
