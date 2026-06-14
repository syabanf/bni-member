import type { MeetingRepository } from "@/domain/repositories/MeetingRepository";
import type { Meeting } from "@/domain/entities/Meeting";
import { meetingsSeed } from "../data/meetings.data";

/** In-memory adapter for {@link MeetingRepository}. */
export class InMemoryMeetingRepository implements MeetingRepository {
  private meetings: Meeting[];

  constructor(seed: Meeting[] = meetingsSeed) {
    this.meetings = seed.map((m) => ({ ...m }));
  }

  async getByChapter(chapterId: string): Promise<Meeting[]> {
    return this.meetings
      .filter((m) => m.chapterId === chapterId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((m) => ({ ...m }));
  }

  async create(input: Omit<Meeting, "id">): Promise<Meeting> {
    const meeting: Meeting = { id: crypto.randomUUID(), ...input };
    this.meetings.push(meeting);
    return { ...meeting };
  }

  async update(id: string, input: Omit<Meeting, "id">): Promise<Meeting> {
    const index = this.meetings.findIndex((m) => m.id === id);
    if (index < 0) throw new Error("Meeting tidak ditemukan");
    this.meetings[index] = { id, ...input };
    return { ...this.meetings[index] };
  }

  async delete(id: string): Promise<void> {
    this.meetings = this.meetings.filter((m) => m.id !== id);
  }
}
