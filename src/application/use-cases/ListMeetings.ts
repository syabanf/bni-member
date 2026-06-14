import type { MeetingRepository } from "@/domain/repositories/MeetingRepository";
import type { Meeting } from "@/domain/entities/Meeting";

/** Lists a chapter's weekly meetings (newest first). */
export class ListMeetings {
  constructor(private readonly meetings: MeetingRepository) {}

  execute(chapterId: string): Promise<Meeting[]> {
    return this.meetings.getByChapter(chapterId);
  }
}
