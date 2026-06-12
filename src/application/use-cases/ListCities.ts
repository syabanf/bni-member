import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { CityWithStats } from "../dto/CityWithStats";

/** Lists cities with their chapter and member counts. */
export class ListCities {
  constructor(
    private readonly cities: CityRepository,
    private readonly chapters: ChapterRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(): Promise<CityWithStats[]> {
    const [cities, chapters, members] = await Promise.all([
      this.cities.getAll(),
      this.chapters.getAll(),
      this.members.getAll(),
    ]);

    return cities.map((city) => {
      const chapterIds = new Set(
        chapters.filter((c) => c.cityId === city.id).map((c) => c.id),
      );
      return {
        city,
        chapterCount: chapterIds.size,
        memberCount: members.filter((m) => chapterIds.has(m.chapterId)).length,
      };
    });
  }
}
