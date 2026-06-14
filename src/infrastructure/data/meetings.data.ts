import type { Meeting } from "@/domain/entities/Meeting";

export const meetingsSeed: Meeting[] = [
  // Rise (Selasa)
  { id: "mt001", chapterId: "ch-rise", date: "2024-06-18", topic: "Networking & Referral Update", attendeeCount: 4, visitorCount: 2 },
  { id: "mt002", chapterId: "ch-rise", date: "2024-06-11", topic: "Speaker: Strategi Closing", attendeeCount: 4, visitorCount: 1 },
  { id: "mt003", chapterId: "ch-rise", date: "2024-06-04", topic: "Power Team Showcase", attendeeCount: 3, visitorCount: 3 },
  // Garuda
  { id: "mt004", chapterId: "ch-garuda", date: "2024-06-17", topic: "Weekly Presentation", attendeeCount: 4, visitorCount: 1 },
  { id: "mt005", chapterId: "ch-garuda", date: "2024-06-10", topic: "1-2-1 Planning", attendeeCount: 3, visitorCount: 0 },
  // Amplify
  { id: "mt006", chapterId: "ch-amplify", date: "2024-06-13", topic: "TYFCB Review", attendeeCount: 4, visitorCount: 2 },
];
