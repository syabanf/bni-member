import type { VisitorRepository } from "@/domain/repositories/VisitorRepository";
import type { Visitor } from "@/domain/entities/Visitor";
import { visitorsSeed } from "../data/visitors.data";

/** In-memory adapter for {@link VisitorRepository}. */
export class InMemoryVisitorRepository implements VisitorRepository {
  private items: Visitor[];

  constructor(seed: Visitor[] = visitorsSeed) {
    this.items = seed.map((v) => ({ ...v }));
  }

  async getAll(): Promise<Visitor[]> {
    return this.items.map((v) => ({ ...v }));
  }

  async create(input: Omit<Visitor, "id">): Promise<Visitor> {
    const item: Visitor = { id: crypto.randomUUID(), ...input };
    this.items.push(item);
    return { ...item };
  }

  async update(id: string, input: Omit<Visitor, "id">): Promise<Visitor> {
    const index = this.items.findIndex((v) => v.id === id);
    if (index < 0) throw new Error("Visitor tidak ditemukan");
    this.items[index] = { id, ...input };
    return { ...this.items[index] };
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((v) => v.id !== id);
  }
}
