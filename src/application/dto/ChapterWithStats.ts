import type { Chapter } from "@/domain/entities/Chapter";

export interface ChapterWithStats {
  chapter: Chapter;
  cityName: string;
  memberCount: number;
}
