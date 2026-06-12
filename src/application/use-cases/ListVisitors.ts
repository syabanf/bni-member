import type { VisitorRepository } from "@/domain/repositories/VisitorRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { VisitorWithContext } from "../dto/VisitorWithContext";

/** Lists visitors enriched with the inviting member and target chapter names. */
export class ListVisitors {
  constructor(
    private readonly visitors: VisitorRepository,
    private readonly members: MemberRepository,
    private readonly chapters: ChapterRepository,
  ) {}

  async execute(): Promise<VisitorWithContext[]> {
    const [visitors, members, chapters] = await Promise.all([
      this.visitors.getAll(),
      this.members.getAll(),
      this.chapters.getAll(),
    ]);
    const memberName = new Map(members.map((m) => [m.id, m.name]));
    const chapterName = new Map(chapters.map((c) => [c.id, c.name]));

    return visitors
      .map((visitor) => ({
        visitor,
        inviterName: memberName.get(visitor.invitedById) ?? "—",
        chapterName: chapterName.get(visitor.chapterId) ?? "—",
      }))
      .sort((a, b) => b.visitor.visitDate.localeCompare(a.visitor.visitDate));
  }
}
