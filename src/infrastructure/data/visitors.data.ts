import type { Visitor } from "@/domain/entities/Visitor";

export const visitorsSeed: Visitor[] = [
  { id: "v001", name: "Andi Pratama", profession: "Konsultan Pajak", company: "AP Tax", email: "andi@example.com", invitedById: "m001", chapterId: "ch-garuda", visitDate: "2024-06-05", status: "Attended" },
  { id: "v002", name: "Bella Sari", profession: "Desainer Interior", company: "Bella Studio", email: "bella@example.com", invitedById: "m004", chapterId: "ch-rise", visitDate: "2024-06-07", status: "Applied" },
  { id: "v003", name: "Candra Wijaya", profession: "Videografer", email: "candra@example.com", invitedById: "m002", chapterId: "ch-magnify", visitDate: "2024-06-11", status: "Invited" },
  { id: "v004", name: "Dina Melati", profession: "Agen Travel", company: "Dina Tour", email: "dina@example.com", invitedById: "m003", chapterId: "ch-amplify", visitDate: "2024-05-28", status: "Member" },
  { id: "v005", name: "Eko Susanto", profession: "Kontraktor", email: "eko@example.com", invitedById: "m006", chapterId: "ch-garuda", visitDate: "2024-05-30", status: "Declined" },
  { id: "v006", name: "Fitri Handayani", profession: "Dokter Hewan", email: "fitri@example.com", invitedById: "m005", chapterId: "ch-glorify", visitDate: "2024-06-12", status: "Attended" },
  { id: "v007", name: "Gunawan Saputra", profession: "Web Developer", email: "gunawan@example.com", invitedById: "m009", chapterId: "ch-rise", visitDate: "2024-06-18", status: "Invited" },
  { id: "v008", name: "Hesti Larasati", profession: "Katering", company: "Hesti Catering", email: "hesti@example.com", invitedById: "m010", chapterId: "ch-glorify", visitDate: "2024-06-19", status: "Applied" },
];
