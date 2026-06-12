import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ChapterWithStats } from "../dto/ChapterWithStats";

/** Lists chapters with their city name and member count (optionally per city). */
export class ListChapters {
  constructor(
    private readonly chapters: ChapterRepository,
    private readonly cities: CityRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(cityId?: string): Promise<ChapterWithStats[]> {
    const [chapters, cities, members] = await Promise.all([
      this.chapters.getAll(),
      this.cities.getAll(),
      this.members.getAll(),
    ]);

    const cityName = new Map(cities.map((c) => [c.id, c.name]));

    return chapters
      .filter((c) => !cityId || c.cityId === cityId)
      .map((chapter) => ({
        chapter,
        cityName: cityName.get(chapter.cityId) ?? "—",
        memberCount: members.filter((m) => m.chapterId === chapter.id).length,
      }));
  }
}
