import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { Member, MemberRole, MemberStatus } from "@/domain/entities/Member";

export interface SaveMemberInput {
  id?: string;
  name: string;
  email: string;
  chapterId: string;
  classification: string;
  role: MemberRole;
  status: MemberStatus;
  subscription: string;
  joinDate: string;
  durationMonths: number;
  registrationFee: number;
  membershipFee: number;
  sponsorId?: string;
}

/**
 * Creates or updates a member, enforcing BNI rules:
 * - the chapter must exist,
 * - the classification must be unique within the chapter,
 * - the sponsor (if any) must exist and not be the member itself.
 */
export class SaveMember {
  constructor(
    private readonly members: MemberRepository,
    private readonly chapters: ChapterRepository,
  ) {}

  async execute(input: SaveMemberInput): Promise<Member> {
    const chapter = await this.chapters.getById(input.chapterId);
    if (!chapter) throw new Error("Chapter tidak valid");

    const classification = input.classification.trim();
    if (!classification) throw new Error("Klasifikasi wajib diisi");

    const inChapter = await this.members.getByChapter(input.chapterId);
    const clash = inChapter.find(
      (m) =>
        m.id !== input.id &&
        m.classification.toLowerCase() === classification.toLowerCase(),
    );
    if (clash) {
      throw new Error(
        `Klasifikasi "${classification}" sudah dipakai ${clash.name} di chapter ${chapter.name}`,
      );
    }

    if (input.sponsorId) {
      if (input.sponsorId === input.id) {
        throw new Error("Member tidak bisa menjadi sponsor dirinya sendiri");
      }
      const sponsor = await this.members.getById(input.sponsorId);
      if (!sponsor) throw new Error("Sponsor tidak ditemukan");
    }

    const { id, ...rest } = input;
    const data: Omit<Member, "id"> = {
      ...rest,
      classification,
      chapter: chapter.name,
    };
    return id ? this.members.update(id, data) : this.members.create(data);
  }
}
