import type { Referral } from "@/domain/entities/Referral";

export const referralsSeed: Referral[] = [
  { id: "r001", fromMemberId: "m001", toMemberId: "m003", date: "2024-05-04", description: "Audit keuangan PT Maju Jaya", tier: "Inside", status: "Closed", tyfcb: 15_000_000 },
  { id: "r002", fromMemberId: "m002", toMemberId: "m005", date: "2024-05-12", description: "Konsultasi pajak tahunan", tier: "Inside", status: "Closed", tyfcb: 8_000_000 },
  { id: "r003", fromMemberId: "m004", toMemberId: "m009", date: "2024-05-20", description: "Asuransi karyawan klinik", tier: "Inside", status: "In Progress", tyfcb: 0 },
  { id: "r004", fromMemberId: "m006", toMemberId: "m011", date: "2024-05-22", description: "Setup jaringan IT kantor baru", tier: "Inside", status: "Closed", tyfcb: 12_000_000 },
  { id: "r005", fromMemberId: "m003", toMemberId: "m008", date: "2024-06-01", description: "Kampanye marketing produk", tier: "Inside", status: "Open", tyfcb: 0 },
  { id: "r006", fromMemberId: "m007", toMemberId: "m012", date: "2024-06-03", description: "Desain interior showroom", tier: "Outside", status: "Closed", tyfcb: 25_000_000 },
  { id: "r007", fromMemberId: "m010", toMemberId: "m015", date: "2024-06-05", description: "Pendampingan hukum kontrak", tier: "Inside", status: "Closed", tyfcb: 6_000_000 },
  { id: "r008", fromMemberId: "m001", toMemberId: "m016", date: "2024-06-08", description: "Foto produk katalog", tier: "Inside", status: "In Progress", tyfcb: 0 },
  { id: "r009", fromMemberId: "m005", toMemberId: "m010", date: "2024-06-10", description: "Sesi foto keluarga", tier: "Inside", status: "Closed", tyfcb: 9_000_000 },
  { id: "r010", fromMemberId: "m013", toMemberId: "m018", date: "2024-06-12", description: "Website company profile", tier: "Inside", status: "Open", tyfcb: 0 },
  { id: "r011", fromMemberId: "m009", toMemberId: "m004", date: "2024-06-14", description: "Pemeriksaan gigi karyawan", tier: "Inside", status: "Closed", tyfcb: 11_000_000 },
  { id: "r012", fromMemberId: "m002", toMemberId: "m017", date: "2024-06-15", description: "Perencanaan keuangan pribadi", tier: "Inside", status: "Cancelled", tyfcb: 0 },
  { id: "r013", fromMemberId: "m008", toMemberId: "m003", date: "2024-06-18", description: "Desain rumah tinggal", tier: "Inside", status: "Closed", tyfcb: 18_000_000 },
  { id: "r014", fromMemberId: "m011", toMemberId: "m006", date: "2024-06-20", description: "Penjualan unit properti", tier: "Inside", status: "Closed", tyfcb: 7_000_000 },
];
