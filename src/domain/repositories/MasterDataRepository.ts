import type { MasterData } from "../entities/MasterData";

/** Port (interface) for master-data access (chapters, plans, regions). */
export interface MasterDataRepository {
  get(): Promise<MasterData>;
}
