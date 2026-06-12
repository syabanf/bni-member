import type { ImportRepository } from "@/domain/repositories/ImportRepository";
import type { ImportRecord } from "@/domain/entities/ImportRecord";
import { importPreviewSeed } from "../data/import.data";

/** In-memory adapter for {@link ImportRepository}. */
export class InMemoryImportRepository implements ImportRepository {
  constructor(private readonly preview: ImportRecord[] = importPreviewSeed) {}

  async getPreview(): Promise<ImportRecord[]> {
    return [...this.preview];
  }
}
