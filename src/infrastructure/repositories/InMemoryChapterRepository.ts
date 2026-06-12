import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { Chapter } from "@/domain/entities/Chapter";
import { chaptersSeed } from "../data/chapters.data";

/** In-memory adapter for {@link ChapterRepository}. Mutations persist per session. */
export class InMemoryChapterRepository implements ChapterRepository {
  private chapters: Chapter[];

  constructor(seed: Chapter[] = chaptersSeed) {
    this.chapters = seed.map((c) => ({ ...c }));
  }

  async getAll(): Promise<Chapter[]> {
    return this.chapters.map((c) => ({ ...c }));
  }

  async getById(id: string): Promise<Chapter | null> {
    const found = this.chapters.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async getByCity(cityId: string): Promise<Chapter[]> {
    return this.chapters.filter((c) => c.cityId === cityId).map((c) => ({ ...c }));
  }

  async create(input: Omit<Chapter, "id">): Promise<Chapter> {
    const chapter: Chapter = { id: crypto.randomUUID(), ...input };
    this.chapters.push(chapter);
    return { ...chapter };
  }

  async update(id: string, input: Omit<Chapter, "id">): Promise<Chapter> {
    const index = this.chapters.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Chapter tidak ditemukan");
    this.chapters[index] = { id, ...input };
    return { ...this.chapters[index] };
  }

  async delete(id: string): Promise<void> {
    this.chapters = this.chapters.filter((c) => c.id !== id);
  }
}
