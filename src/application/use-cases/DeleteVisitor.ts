import type { VisitorRepository } from "@/domain/repositories/VisitorRepository";

export class DeleteVisitor {
  constructor(private readonly visitors: VisitorRepository) {}

  execute(id: string): Promise<void> {
    return this.visitors.delete(id);
  }
}
