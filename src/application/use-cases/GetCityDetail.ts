import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { CityDetail } from "../dto/CityDetail";

/** Returns a city with its chapters (and each chapter's member count). */
export class GetCityDetail {
  constructor(
    private readonly cities: CityRepository,
    private readonly chapters: ChapterRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(id: string): Promise<CityDetail> {
    const city = await this.cities.getById(id);
    if (!city) throw new Error("Kota tidak ditemukan");

    const [chapters, members] = await Promise.all([
      this.chapters.getByCity(id),
      this.members.getAll(),
    ]);

    const chapterIds = new Set(chapters.map((c) => c.id));
    return {
      city,
      chapters: chapters.map((chapter) => ({
        chapter,
        memberCount: members.filter((m) => m.chapterId === chapter.id).length,
      })),
      memberCount: members.filter((m) => chapterIds.has(m.chapterId)).length,
    };
  }
}
