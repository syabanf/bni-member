import type { City } from "../entities/City";

/** Port (interface) for city persistence with full CRUD. */
export interface CityRepository {
  getAll(): Promise<City[]>;
  getById(id: string): Promise<City | null>;
  create(input: Omit<City, "id">): Promise<City>;
  update(id: string, input: Omit<City, "id">): Promise<City>;
  delete(id: string): Promise<void>;
}
