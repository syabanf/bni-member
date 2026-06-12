import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { City, CityStatus } from "@/domain/entities/City";

export interface SaveCityInput {
  id?: string;
  name: string;
  code: string;
  province: string;
  status: CityStatus;
}

/** Creates a city (no id) or updates an existing one (id present). */
export class SaveCity {
  constructor(private readonly cities: CityRepository) {}

  execute(input: SaveCityInput): Promise<City> {
    const { id, ...data } = input;
    return id ? this.cities.update(id, data) : this.cities.create(data);
  }
}
