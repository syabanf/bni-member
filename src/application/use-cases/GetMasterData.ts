import type { MasterDataRepository } from "@/domain/repositories/MasterDataRepository";
import type { MasterData } from "@/domain/entities/MasterData";

/** Returns master data (chapters, plans, regions). */
export class GetMasterData {
  constructor(private readonly repo: MasterDataRepository) {}

  execute(): Promise<MasterData> {
    return this.repo.get();
  }
}
