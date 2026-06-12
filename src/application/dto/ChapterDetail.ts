import type { Chapter } from "@/domain/entities/Chapter";
import type { Member } from "@/domain/entities/Member";

export interface ChapterDetail {
  chapter: Chapter;
  cityName: string;
  members: Member[];
}
