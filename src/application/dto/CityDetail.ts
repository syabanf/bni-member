import type { City } from "@/domain/entities/City";
import type { Chapter } from "@/domain/entities/Chapter";
import type { Member } from "@/domain/entities/Member";

export interface CityChapterSummary {
  chapter: Chapter;
  memberCount: number;
}

export interface CityDetail {
  city: City;
  chapters: CityChapterSummary[];
  /** All members across the city's chapters (for drill-down). */
  members: Member[];
  memberCount: number;
}
