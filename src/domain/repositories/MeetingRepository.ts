import type { Meeting } from "@/domain/entities/Meeting";

export interface MeetingRepository {
  getByChapter(chapterId: string): Promise<Meeting[]>;
  create(input: Omit<Meeting, "id">): Promise<Meeting>;
  update(id: string, input: Omit<Meeting, "id">): Promise<Meeting>;
  delete(id: string): Promise<void>;
}
