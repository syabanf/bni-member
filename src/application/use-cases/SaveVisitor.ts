import type { VisitorRepository } from "@/domain/repositories/VisitorRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { Visitor, VisitorStatus } from "@/domain/entities/Visitor";

export interface SaveVisitorInput {
  id?: string;
  name: string;
  profession: string;
  company?: string;
  email?: string;
  invitedById: string;
  chapterId: string;
  visitDate: string;
  status: VisitorStatus;
}

/** Creates or updates a visitor; validates the inviting member and chapter. */
export class SaveVisitor {
  constructor(
    private readonly visitors: VisitorRepository,
    private readonly members: MemberRepository,
    private readonly chapters: ChapterRepository,
  ) {}

  async execute(input: SaveVisitorInput): Promise<Visitor> {
    const [inviter, chapter] = await Promise.all([
      this.members.getById(input.invitedById),
      this.chapters.getById(input.chapterId),
    ]);
    if (!inviter) throw new Error("Member pengundang tidak valid");
    if (!chapter) throw new Error("Chapter tidak valid");

    const { id, ...data } = input;
    return id ? this.visitors.update(id, data) : this.visitors.create(data);
  }
}
