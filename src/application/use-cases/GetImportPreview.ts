import type { ImportRepository } from "@/domain/repositories/ImportRepository";
import type { ImportRecord } from "@/domain/entities/ImportRecord";

/** Returns the preview of the most recently imported member rows. */
export class GetImportPreview {
  constructor(private readonly repo: ImportRepository) {}

  execute(): Promise<ImportRecord[]> {
    return this.repo.getPreview();
  }
}
