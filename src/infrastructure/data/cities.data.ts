import type { City } from "@/domain/entities/City";

export const citiesSeed: City[] = [
  { id: "city-jkt", name: "Jakarta", code: "JKT", province: "DKI Jakarta", status: "Active" },
  { id: "city-bdg", name: "Bandung", code: "BDG", province: "Jawa Barat", status: "Active" },
  { id: "city-sby", name: "Surabaya", code: "SBY", province: "Jawa Timur", status: "Active" },
  { id: "city-tgr", name: "Tangerang", code: "TGR", province: "Banten", status: "Active" },
];
