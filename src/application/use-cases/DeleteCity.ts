import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";

/** Deletes a city, refusing if it still has chapters. */
export class DeleteCity {
  constructor(
    private readonly cities: CityRepository,
    private readonly chapters: ChapterRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const chapters = await this.chapters.getByCity(id);
    if (chapters.length > 0) {
      throw new Error(
        `Tidak bisa hapus: kota masih memiliki ${chapters.length} chapter`,
      );
    }
    await this.cities.delete(id);
  }
}
