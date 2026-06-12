import type { Chapter } from "../entities/Chapter";

/** Port (interface) for chapter persistence with full CRUD. */
export interface ChapterRepository {
  getAll(): Promise<Chapter[]>;
  getById(id: string): Promise<Chapter | null>;
  getByCity(cityId: string): Promise<Chapter[]>;
  create(input: Omit<Chapter, "id">): Promise<Chapter>;
  update(id: string, input: Omit<Chapter, "id">): Promise<Chapter>;
  delete(id: string): Promise<void>;
}
