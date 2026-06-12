import type { Visitor } from "@/domain/entities/Visitor";

export interface VisitorWithContext {
  visitor: Visitor;
  inviterName: string;
  chapterName: string;
}
