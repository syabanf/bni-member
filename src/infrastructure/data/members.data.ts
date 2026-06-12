import type { Member } from "@/domain/entities/Member";

/** Seed data — replace with an API-backed source later. */
export const membersSeed: Member[] = [
  { id: "m001", name: "Ahmad Wijaya", email: "ahmad.wijaya@example.com", chapter: "Garuda", joinDate: "2024-01-15", status: "Active", subscription: "Premium" },
  { id: "m002", name: "Siti Nurhaliza", email: "siti.nurhaliza@example.com", chapter: "Magnify", joinDate: "2024-02-20", status: "Active", subscription: "Basic" },
  { id: "m003", name: "Budi Santoso", email: "budi.santoso@example.com", chapter: "Amplify", joinDate: "2024-03-10", status: "Pending", subscription: "Premium" },
  { id: "m004", name: "Dewi Lestari", email: "dewi.lestari@example.com", chapter: "Rise", joinDate: "2024-01-05", status: "Active", subscription: "Basic" },
  { id: "m005", name: "Hendra Pratama", email: "hendra.pratama@example.com", chapter: "Glorify", joinDate: "2023-12-01", status: "Overdue", subscription: "Premium" },
  { id: "m006", name: "Rina Kusuma", email: "rina.kusuma@example.com", chapter: "Garuda", joinDate: "2024-04-15", status: "Active", subscription: "Basic" },
  { id: "m007", name: "Joko Widodo", email: "joko.widodo@example.com", chapter: "Magnify", joinDate: "2023-11-20", status: "Expired", subscription: "Premium" },
  { id: "m008", name: "Lina Marlina", email: "lina.marlina@example.com", chapter: "Amplify", joinDate: "2024-05-01", status: "Active", subscription: "Basic" },
  { id: "m009", name: "Maman Suherman", email: "maman.suherman@example.com", chapter: "Rise", joinDate: "2024-02-28", status: "Pending", subscription: "Premium" },
  { id: "m010", name: "Nina Agustina", email: "nina.agustina@example.com", chapter: "Glorify", joinDate: "2024-03-22", status: "Active", subscription: "Basic" },
  { id: "m011", name: "Oscar Mulia", email: "oscar.mulia@example.com", chapter: "Garuda", joinDate: "2024-06-10", status: "Active", subscription: "Premium" },
  { id: "m012", name: "Putri Ayu", email: "putri.ayu@example.com", chapter: "Magnify", joinDate: "2024-04-05", status: "Overdue", subscription: "Basic" },
  { id: "m013", name: "Qori Hastuti", email: "qori.hastuti@example.com", chapter: "Amplify", joinDate: "2024-01-30", status: "Active", subscription: "Premium" },
  { id: "m014", name: "Rian Firmansah", email: "rian.firmansah@example.com", chapter: "Rise", joinDate: "2023-10-15", status: "Expired", subscription: "Basic" },
  { id: "m015", name: "Sari Dewi", email: "sari.dewi@example.com", chapter: "Glorify", joinDate: "2024-05-20", status: "Active", subscription: "Premium" },
  { id: "m016", name: "Toni Gunawan", email: "toni.gunawan@example.com", chapter: "Garuda", joinDate: "2024-03-01", status: "Pending", subscription: "Basic" },
  { id: "m017", name: "Umi Kulsum", email: "umi.kulsum@example.com", chapter: "Magnify", joinDate: "2024-02-14", status: "Active", subscription: "Premium" },
  { id: "m018", name: "Vino Baskara", email: "vino.baskara@example.com", chapter: "Amplify", joinDate: "2024-06-01", status: "Active", subscription: "Basic" },
  { id: "m019", name: "Wati Rohayu", email: "wati.rohayu@example.com", chapter: "Rise", joinDate: "2024-04-25", status: "Overdue", subscription: "Premium" },
  { id: "m020", name: "Yusuf Firdaus", email: "yusuf.firdaus@example.com", chapter: "Glorify", joinDate: "2024-01-10", status: "Active", subscription: "Basic" },
];

/** The set of chapters used across the app. */
export const chaptersSeed = ["Grow", "Rise", "Amplify", "Glorify", "Magnify", "Garuda"];
