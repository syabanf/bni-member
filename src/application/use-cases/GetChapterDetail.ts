import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ChapterDetail } from "../dto/ChapterDetail";

/** Returns a chapter with its city name and member roster. */
export class GetChapterDetail {
  constructor(
    private readonly chapters: ChapterRepository,
    private readonly cities: CityRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(id: string): Promise<ChapterDetail> {
    const chapter = await this.chapters.getById(id);
    if (!chapter) throw new Error("Chapter tidak ditemukan");

    const [city, members] = await Promise.all([
      this.cities.getById(chapter.cityId),
      this.members.getByChapter(id),
    ]);

    return { chapter, cityName: city?.name ?? "—", members };
  }
}
