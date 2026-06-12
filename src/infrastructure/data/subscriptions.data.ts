import type { Subscription } from "@/domain/entities/Subscription";

// Plans are BNI term packages (1 / 2 / 5 Tahun); amount = the package total.
export const subscriptionsSeed: Subscription[] = [
  { id: "s001", memberId: "m001", memberName: "Ahmad Wijaya", plan: "2 Tahun", amount: 18000000, status: "Active", startDate: "2024-01-15", endDate: "2026-01-15" },
  { id: "s002", memberId: "m002", memberName: "Siti Nurhaliza", plan: "1 Tahun", amount: 11000000, status: "Active", startDate: "2024-02-20", endDate: "2025-02-20" },
  { id: "s003", memberId: "m003", memberName: "Budi Santoso", plan: "2 Tahun", amount: 18000000, status: "Pending", startDate: "2024-03-10", endDate: "2026-03-10" },
  { id: "s004", memberId: "m004", memberName: "Dewi Lestari", plan: "1 Tahun", amount: 11000000, status: "Active", startDate: "2024-01-05", endDate: "2025-01-05" },
  { id: "s005", memberId: "m005", memberName: "Hendra Pratama", plan: "5 Tahun", amount: 40000000, status: "Expired", startDate: "2023-12-01", endDate: "2028-12-01" },
  { id: "s006", memberId: "m006", memberName: "Rina Kusuma", plan: "1 Tahun", amount: 11000000, status: "Active", startDate: "2024-04-15", endDate: "2025-04-15" },
  { id: "s007", memberId: "m007", memberName: "Joko Widodo", plan: "5 Tahun", amount: 40000000, status: "Expired", startDate: "2023-11-20", endDate: "2028-11-20" },
  { id: "s008", memberId: "m008", memberName: "Lina Marlina", plan: "2 Tahun", amount: 18000000, status: "Active", startDate: "2024-05-01", endDate: "2026-05-01" },
];
