import type { Visitor } from "../entities/Visitor";

/** Port (interface) for visitor persistence with CRUD. */
export interface VisitorRepository {
  getAll(): Promise<Visitor[]>;
  create(input: Omit<Visitor, "id">): Promise<Visitor>;
  update(id: string, input: Omit<Visitor, "id">): Promise<Visitor>;
  delete(id: string): Promise<void>;
}
