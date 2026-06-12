import type { MasterData } from "@/domain/entities/MasterData";

export const masterDataSeed: MasterData = {
  chapters: [
    { id: "c001", name: "Jakarta Utara", code: "JKU", region: "Jakarta", members: 45, status: "Active" },
    { id: "c002", name: "Jakarta Selatan", code: "JKS", region: "Jakarta", members: 52, status: "Active" },
    { id: "c003", name: "BSD", code: "BSD", region: "Tangerang", members: 38, status: "Active" },
    { id: "c004", name: "Surabaya", code: "SBY", region: "Jawa Timur", members: 41, status: "Active" },
    { id: "c005", name: "Bandung", code: "BDG", region: "Jawa Barat", members: 35, status: "Active" },
  ],
  plans: [
    { id: "p001", name: "Basic", price: 1500000, duration: "12 months", features: ["Basic Support", "Member Directory"], status: "Active" },
    { id: "p002", name: "Premium", price: 2500000, duration: "12 months", features: ["Priority Support", "Member Directory", "Event Access", "Training"], status: "Active" },
  ],
  regions: [
    { id: "r001", name: "Jakarta", code: "JKT", chapters: 5, members: 120 },
    { id: "r002", name: "Jawa Barat", code: "JBR", chapters: 3, members: 85 },
    { id: "r003", name: "Jawa Timur", code: "JTM", chapters: 2, members: 65 },
    { id: "r004", name: "Tangerang", code: "TGR", chapters: 1, members: 38 },
  ],
};
