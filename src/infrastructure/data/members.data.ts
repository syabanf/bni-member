import type { Member } from "@/domain/entities/Member";

// Standard fees (IDR): one-time registration + recurring annual membership.
const REG = 2_500_000;
const FEE = 8_500_000;

/**
 * Seed members. Each belongs to a chapter, holds a unique classification within
 * that chapter, and (except founders) was sponsored by another member.
 */
// subscription (package term) is derived from durationMonths in the repository.
export const membersSeed: Omit<Member, "subscription">[] = [
  // Garuda (Tangerang)
  { id: "m001", name: "Ahmad Wijaya", email: "ahmad.wijaya@example.com", chapter: "Garuda", chapterId: "ch-garuda", classification: "Akuntan", role: "President", status: "Active", joinDate: "2024-01-15", durationMonths: 24, registrationFee: REG, membershipFee: FEE, phone: "0812-3456-0001" },
  { id: "m006", name: "Rina Kusuma", email: "rina.kusuma@example.com", chapter: "Garuda", chapterId: "ch-garuda", classification: "Agen Properti", role: "Vice President", status: "Active", joinDate: "2024-04-15", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m001", phone: "0812-3456-0002" },
  { id: "m011", name: "Oscar Mulia", email: "oscar.mulia@example.com", chapter: "Garuda", chapterId: "ch-garuda", classification: "Konsultan IT", role: "Secretary/Treasurer", status: "Active", joinDate: "2024-06-10", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m006", phone: "0812-3456-0003" },
  { id: "m016", name: "Toni Gunawan", email: "toni.gunawan@example.com", chapter: "Garuda", chapterId: "ch-garuda", classification: "Fotografer", role: "Member", status: "Pending", joinDate: "2024-03-01", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m001", phone: "0812-3456-0004" },

  // Magnify (Surabaya)
  { id: "m002", name: "Siti Nurhaliza", email: "siti.nurhaliza@example.com", chapter: "Magnify", chapterId: "ch-magnify", classification: "Pengacara", role: "President", status: "Active", joinDate: "2024-02-20", durationMonths: 12, registrationFee: REG, membershipFee: FEE, phone: "0812-3456-0005" },
  { id: "m007", name: "Joko Widodo", email: "joko.widodo@example.com", chapter: "Magnify", chapterId: "ch-magnify", classification: "Kontraktor", role: "Vice President", status: "Expired", joinDate: "2023-11-20", durationMonths: 60, registrationFee: REG, membershipFee: FEE, sponsorId: "m002", phone: "0812-3456-0006" },
  { id: "m012", name: "Putri Ayu", email: "putri.ayu@example.com", chapter: "Magnify", chapterId: "ch-magnify", classification: "Desainer Interior", role: "Secretary/Treasurer", status: "Overdue", joinDate: "2024-04-05", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m007", phone: "0812-3456-0007" },
  { id: "m017", name: "Umi Kulsum", email: "umi.kulsum@example.com", chapter: "Magnify", chapterId: "ch-magnify", classification: "Financial Planner", role: "Member", status: "Active", joinDate: "2024-02-14", durationMonths: 24, registrationFee: REG, membershipFee: FEE, sponsorId: "m002", phone: "0812-3456-0008" },

  // Amplify (Bandung)
  { id: "m003", name: "Budi Santoso", email: "budi.santoso@example.com", chapter: "Amplify", chapterId: "ch-amplify", classification: "Arsitek", role: "President", status: "Pending", joinDate: "2024-03-10", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m001", phone: "0812-3456-0009" },
  { id: "m008", name: "Lina Marlina", email: "lina.marlina@example.com", chapter: "Amplify", chapterId: "ch-amplify", classification: "Marketing Digital", role: "Vice President", status: "Active", joinDate: "2024-05-01", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m003", phone: "0812-3456-0010" },
  { id: "m013", name: "Qori Hastuti", email: "qori.hastuti@example.com", chapter: "Amplify", chapterId: "ch-amplify", classification: "Notaris", role: "Secretary/Treasurer", status: "Active", joinDate: "2024-01-30", durationMonths: 24, registrationFee: REG, membershipFee: FEE, sponsorId: "m003", phone: "0812-3456-0011" },
  { id: "m018", name: "Vino Baskara", email: "vino.baskara@example.com", chapter: "Amplify", chapterId: "ch-amplify", classification: "Web Developer", role: "Member", status: "Active", joinDate: "2024-06-01", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m008", phone: "0812-3456-0012" },

  // Rise (Jakarta)
  { id: "m004", name: "Dewi Lestari", email: "dewi.lestari@example.com", chapter: "Rise", chapterId: "ch-rise", classification: "Dokter Gigi", role: "President", status: "Active", joinDate: "2024-01-05", durationMonths: 24, registrationFee: REG, membershipFee: FEE, phone: "0812-3456-0013" },
  { id: "m009", name: "Maman Suherman", email: "maman.suherman@example.com", chapter: "Rise", chapterId: "ch-rise", classification: "Agen Asuransi", role: "Vice President", status: "Pending", joinDate: "2024-02-28", durationMonths: 24, registrationFee: REG, membershipFee: FEE, sponsorId: "m004", phone: "0812-3456-0014" },
  { id: "m014", name: "Rian Firmansah", email: "rian.firmansah@example.com", chapter: "Rise", chapterId: "ch-rise", classification: "Travel Agent", role: "Secretary/Treasurer", status: "Expired", joinDate: "2023-10-15", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m009", phone: "0812-3456-0015" },
  { id: "m019", name: "Wati Rohayu", email: "wati.rohayu@example.com", chapter: "Rise", chapterId: "ch-rise", classification: "Katering", role: "Member", status: "Overdue", joinDate: "2024-04-25", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m004", phone: "0812-3456-0016" },

  // Glorify (Bandung)
  { id: "m005", name: "Hendra Pratama", email: "hendra.pratama@example.com", chapter: "Glorify", chapterId: "ch-glorify", classification: "Akuntan", role: "President", status: "Overdue", joinDate: "2023-12-01", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m002", phone: "0812-3456-0017" },
  { id: "m010", name: "Nina Agustina", email: "nina.agustina@example.com", chapter: "Glorify", chapterId: "ch-glorify", classification: "Fotografer", role: "Vice President", status: "Active", joinDate: "2024-03-22", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m005", phone: "0812-3456-0018" },
  { id: "m015", name: "Sari Dewi", email: "sari.dewi@example.com", chapter: "Glorify", chapterId: "ch-glorify", classification: "Pengacara", role: "Secretary/Treasurer", status: "Active", joinDate: "2024-05-20", durationMonths: 12, registrationFee: REG, membershipFee: FEE, sponsorId: "m005", phone: "0812-3456-0019" },
  { id: "m020", name: "Yusuf Firdaus", email: "yusuf.firdaus@example.com", chapter: "Glorify", chapterId: "ch-glorify", classification: "Konsultan Pajak", role: "Member", status: "Active", joinDate: "2024-01-10", durationMonths: 60, registrationFee: REG, membershipFee: FEE, sponsorId: "m010", phone: "0812-3456-0020" },
];
