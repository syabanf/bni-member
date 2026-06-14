import type { MeetingRepository } from "@/domain/repositories/MeetingRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { Meeting } from "@/domain/entities/Meeting";

export interface SaveMeetingInput {
  id?: string;
  chapterId: string;
  date: string;
  topic: string;
  attendeeCount: number;
  visitorCount: number;
  notes?: string;
}

/** Creates or updates a weekly meeting; validates the chapter and topic. */
export class SaveMeeting {
  constructor(
    private readonly meetings: MeetingRepository,
    private readonly chapters: ChapterRepository,
  ) {}

  async execute(input: SaveMeetingInput): Promise<Meeting> {
    const chapter = await this.chapters.getById(input.chapterId);
    if (!chapter) throw new Error("Chapter tidak valid");
    if (!input.topic.trim()) throw new Error("Topik meeting wajib diisi");

    const { id, ...data } = input;
    return id ? this.meetings.update(id, data) : this.meetings.create(data);
  }
}
