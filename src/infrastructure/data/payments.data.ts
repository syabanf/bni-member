import type {
  PaymentRecord,
  PaymentSummary,
  PaymentDistributionSlice,
} from "@/domain/entities/Payment";

export const paymentsSeed: PaymentRecord[] = [
  { id: "p001", memberId: "m001", memberName: "Ahmad Wijaya", email: "ahmad.wijaya@example.com", chapter: "Garuda", status: "Active", paymentStatus: "Paid", date: "2024-06-01", amount: 2500000, phone: "0812-7788-0001" },
  { id: "p002", memberId: "m002", memberName: "Siti Nurhaliza", email: "siti.nurhaliza@example.com", chapter: "Magnify", status: "Active", paymentStatus: "Outstanding", date: "2024-06-15", amount: 1500000, phone: "0812-7788-0002" },
  { id: "p003", memberId: "m003", memberName: "Budi Santoso", email: "budi.santoso@example.com", chapter: "Amplify", status: "Pending", paymentStatus: "Awaiting", date: "2024-06-18", amount: 2500000, phone: "0812-7788-0003" },
  { id: "p004", memberId: "m004", memberName: "Dewi Lestari", email: "dewi.lestari@example.com", chapter: "Rise", status: "Active", paymentStatus: "Paid", date: "2024-06-10", amount: 1500000, phone: "0812-7788-0004" },
  { id: "p005", memberId: "m005", memberName: "Hendra Pratama", email: "hendra.pratama@example.com", chapter: "Glorify", status: "Overdue", paymentStatus: "Overdue", date: "2024-05-01", amount: 2500000, phone: "0812-7788-0005" },
  { id: "p006", memberId: "m006", memberName: "Rina Kusuma", email: "rina.kusuma@example.com", chapter: "Garuda", status: "Active", paymentStatus: "Paid", date: "2024-06-05", amount: 1500000, phone: "0812-7788-0006" },
  { id: "p007", memberId: "m007", memberName: "Joko Widodo", email: "joko.widodo@example.com", chapter: "Magnify", status: "Expired", paymentStatus: "Overdue", date: "2024-04-20", amount: 2500000, phone: "0812-7788-0007" },
  { id: "p008", memberId: "m008", memberName: "Lina Marlina", email: "lina.marlina@example.com", chapter: "Amplify", status: "Active", paymentStatus: "Outstanding", date: "2024-06-12", amount: 1500000, phone: "0812-7788-0008" },
  { id: "p009", memberId: "m009", memberName: "Maman Suherman", email: "maman.suherman@example.com", chapter: "Rise", status: "Pending", paymentStatus: "Awaiting", date: "2024-06-20", amount: 2500000, phone: "0812-7788-0009" },
  { id: "p010", memberId: "m010", memberName: "Nina Agustina", email: "nina.agustina@example.com", chapter: "Glorify", status: "Active", paymentStatus: "Paid", date: "2024-06-08", amount: 1500000, phone: "0812-7788-0010" },
];

export const paymentSummarySeed: PaymentSummary = {
  outstanding: 48,
  awaiting: 23,
  renewal: 15,
  overdue: 7,
};

export const paymentDistributionSeed: PaymentDistributionSlice[] = [
  { name: "Paid", value: 85, color: "#16A34A" },
  { name: "Outstanding", value: 48, color: "#CC0000" },
  { name: "Overdue", value: 7, color: "#DC2626" },
  { name: "Awaiting", value: 23, color: "#F59E0B" },
];
