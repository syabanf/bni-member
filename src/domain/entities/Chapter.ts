/**
 * Domain entity: a BNI chapter. Belongs to one city and contains many members.
 * Chapters meet weekly and have a single member per professional classification.
 */
export type ChapterStatus = "Active" | "Inactive" | "Forming";

export interface Chapter {
  id: string;
  name: string;
  code: string;
  cityId: string; // FK -> City
  status: ChapterStatus;
  meetingDay: string; // e.g. "Selasa"
  meetingTime: string; // e.g. "07:00"
  venue: string;
  launchDate: string;
}
