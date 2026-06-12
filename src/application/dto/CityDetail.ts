import type { City } from "@/domain/entities/City";
import type { Chapter } from "@/domain/entities/Chapter";

export interface CityChapterSummary {
  chapter: Chapter;
  memberCount: number;
}

export interface CityDetail {
  city: City;
  chapters: CityChapterSummary[];
  memberCount: number;
}
