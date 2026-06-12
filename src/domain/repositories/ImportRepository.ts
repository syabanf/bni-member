import type { ImportRecord } from "../entities/ImportRecord";

/** Port (interface) for import-preview data access. */
export interface ImportRepository {
  getPreview(): Promise<ImportRecord[]>;
}
