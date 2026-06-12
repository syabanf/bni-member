import type { Subscription } from "@/domain/entities/Subscription";

export const subscriptionsSeed: Subscription[] = [
  { id: "s001", memberId: "m001", memberName: "Ahmad Wijaya", plan: "Premium", amount: 13000000, status: "Active", startDate: "2024-01-15", endDate: "2025-01-15" },
  { id: "s002", memberId: "m002", memberName: "Siti Nurhaliza", plan: "Basic", amount: 13000000, status: "Active", startDate: "2024-02-20", endDate: "2025-02-20" },
  { id: "s003", memberId: "m003", memberName: "Budi Santoso", plan: "Premium", amount: 13000000, status: "Pending", startDate: "2024-03-10", endDate: "2025-03-10" },
  { id: "s004", memberId: "m004", memberName: "Dewi Lestari", plan: "Basic", amount: 13000000, status: "Active", startDate: "2024-01-05", endDate: "2025-01-05" },
  { id: "s005", memberId: "m005", memberName: "Hendra Pratama", plan: "Premium", amount: 13000000, status: "Expired", startDate: "2023-12-01", endDate: "2024-12-01" },
  { id: "s006", memberId: "m006", memberName: "Rina Kusuma", plan: "Basic", amount: 13000000, status: "Active", startDate: "2024-04-15", endDate: "2025-04-15" },
  { id: "s007", memberId: "m007", memberName: "Joko Widodo", plan: "Premium", amount: 13000000, status: "Expired", startDate: "2023-11-20", endDate: "2024-11-20" },
  { id: "s008", memberId: "m008", memberName: "Lina Marlina", plan: "Basic", amount: 13000000, status: "Active", startDate: "2024-05-01", endDate: "2025-05-01" },
];
