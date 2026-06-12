import type { CityRepository } from "@/domain/repositories/CityRepository";
import type { City } from "@/domain/entities/City";
import { citiesSeed } from "../data/cities.data";

/** In-memory adapter for {@link CityRepository}. Mutations persist per session. */
export class InMemoryCityRepository implements CityRepository {
  private cities: City[];

  constructor(seed: City[] = citiesSeed) {
    this.cities = seed.map((c) => ({ ...c }));
  }

  async getAll(): Promise<City[]> {
    return this.cities.map((c) => ({ ...c }));
  }

  async getById(id: string): Promise<City | null> {
    const found = this.cities.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async create(input: Omit<City, "id">): Promise<City> {
    const city: City = { id: crypto.randomUUID(), ...input };
    this.cities.push(city);
    return { ...city };
  }

  async update(id: string, input: Omit<City, "id">): Promise<City> {
    const index = this.cities.findIndex((c) => c.id === id);
    if (index < 0) throw new Error("Kota tidak ditemukan");
    this.cities[index] = { id, ...input };
    return { ...this.cities[index] };
  }

  async delete(id: string): Promise<void> {
    this.cities = this.cities.filter((c) => c.id !== id);
  }
}
