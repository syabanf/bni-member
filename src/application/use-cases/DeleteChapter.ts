import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { MemberRepository } from "@/domain/repositories/MemberRepository";

/** Deletes a chapter, refusing if it still has members. */
export class DeleteChapter {
  constructor(
    private readonly chapters: ChapterRepository,
    private readonly members: MemberRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const members = await this.members.getByChapter(id);
    if (members.length > 0) {
      throw new Error(
        `Tidak bisa hapus: chapter masih memiliki ${members.length} member`,
      );
    }
    await this.chapters.delete(id);
  }
}
