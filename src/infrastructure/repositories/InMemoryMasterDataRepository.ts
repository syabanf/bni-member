import type { MasterDataRepository } from "@/domain/repositories/MasterDataRepository";
import type { MasterData } from "@/domain/entities/MasterData";
import { masterDataSeed } from "../data/masterData.data";

/** In-memory adapter for {@link MasterDataRepository}. */
export class InMemoryMasterDataRepository implements MasterDataRepository {
  constructor(private readonly data: MasterData = masterDataSeed) {}

  async get(): Promise<MasterData> {
    return this.data;
  }
}
