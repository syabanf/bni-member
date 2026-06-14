/**
 * Domain entity: a weekly chapter meeting record.
 * Chapters meet weekly; each session logs attendance and visitors.
 */
export interface Meeting {
  id: string;
  chapterId: string;
  /** Meeting date (ISO yyyy-mm-dd). */
  date: string;
  /** Agenda / theme of the session. */
  topic: string;
  /** Members present. */
  attendeeCount: number;
  /** Visitors present. */
  visitorCount: number;
  notes?: string;
}
