import type { MembershipPackage } from "@/domain/entities/MembershipPackage";

const REG = 2_500_000;
const ANNUAL = 8_500_000;

const COMMON = [
  "Kursi eksklusif — 1 profesi per chapter",
  "Pertemuan networking mingguan",
  "Akses BNI Connect & tools referral",
  "Member Success Program (pelatihan)",
];

export const packagesSeed: MembershipPackage[] = [
  {
    id: "pkg-1y",
    name: "Member 1 Tahun",
    term: "1 Tahun",
    durationMonths: 12,
    registrationFee: REG,
    annualFee: ANNUAL,
    total: REG + ANNUAL, // 11.000.000
    features: COMMON,
  },
  {
    id: "pkg-2y",
    name: "Member 2 Tahun",
    term: "2 Tahun",
    durationMonths: 24,
    registrationFee: REG,
    annualFee: ANNUAL,
    total: 18_000_000, // hemat ±1,5jt vs bayar tahunan
    features: [...COMMON, "Harga terkunci (hemat multi-tahun)", "Prioritas event regional"],
    recommended: true,
  },
  {
    id: "pkg-5y",
    name: "Member 5 Tahun",
    term: "5 Tahun",
    durationMonths: 60,
    registrationFee: REG,
    annualFee: ANNUAL,
    total: 40_000_000, // hemat ±5jt
    features: [
      ...COMMON,
      "Harga terkunci (hemat maksimal)",
      "Prioritas event regional & nasional",
      "Pendampingan mentor senior",
    ],
  },
];
