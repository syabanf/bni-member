import type { User } from "@/domain/entities/User";

export interface SeedUser extends User {
  password: string;
}

/** Dummy accounts (password is "password" for all). */
export const usersSeed: SeedUser[] = [
  { id: "u-admin", name: "Admin Nasional", email: "admin@bni.id", role: "National Admin", password: "password" },
  { id: "u-ahmad", name: "Ahmad Wijaya", email: "ahmad@bni.id", role: "Chapter President", chapterId: "ch-garuda", chapterName: "Garuda", password: "password" },
  { id: "u-dewi", name: "Dewi Lestari", email: "dewi@bni.id", role: "Chapter President", chapterId: "ch-rise", chapterName: "Rise", password: "password" },
  { id: "u-budi", name: "Budi Santoso", email: "budi@bni.id", role: "Vice President", chapterId: "ch-amplify", chapterName: "Amplify", password: "password" },
  { id: "u-rina", name: "Rina Kusuma", email: "rina@bni.id", role: "Member", chapterId: "ch-garuda", chapterName: "Garuda", password: "password" },
];
