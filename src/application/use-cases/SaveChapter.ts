import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { Chapter, ChapterStatus } from "@/domain/entities/Chapter";

export interface SaveChapterInput {
  id?: string;
  name: string;
  code: string;
  cityId: string;
  status: ChapterStatus;
  meetingDay: string;
  meetingTime: string;
  venue: string;
  launchDate: string;
}

/** Creates or updates a chapter; validates that the parent city exists. */
export class SaveChapter {
  constructor(
    private readonly chapters: ChapterRepository,
    private readonly cities: CityRepository,
  ) {}

  async execute(input: SaveChapterInput): Promise<Chapter> {
    const city = await this.cities.getById(input.cityId);
    if (!city) throw new Error("Kota tidak valid");

    const { id, ...data } = input;
    return id ? this.chapters.update(id, data) : this.chapters.create(data);
  }
}
