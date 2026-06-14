import type { MeetingRepository } from "@/domain/repositories/MeetingRepository";

/** Deletes a weekly meeting record. */
export class DeleteMeeting {
  constructor(private readonly meetings: MeetingRepository) {}

  execute(id: string): Promise<void> {
    return this.meetings.delete(id);
  }
}
