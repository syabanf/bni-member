import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { ChapterRepository } from "@/domain/repositories/ChapterRepository";
import type { CityRepository } from "@/domain/repositories/CityRepository";
import { memberRenewalDate } from "@/domain/entities/Member";
import type { MemberDetail } from "../dto/MemberDetail";

/** Returns a member's full profile, including sponsor and referral downline. */
export class GetMemberDetail {
  constructor(
    private readonly members: MemberRepository,
    private readonly chapters: ChapterRepository,
    private readonly cities: CityRepository,
  ) {}

  async execute(id: string): Promise<MemberDetail> {
    const member = await this.members.getById(id);
    if (!member) throw new Error("Member tidak ditemukan");

    const chapter = await this.chapters.getById(member.chapterId);
    const [city, sponsor, all] = await Promise.all([
      chapter ? this.cities.getById(chapter.cityId) : Promise.resolve(null),
      member.sponsorId ? this.members.getById(member.sponsorId) : Promise.resolve(null),
      this.members.getAll(),
    ]);

    return {
      member,
      chapterName: chapter?.name ?? member.chapter,
      cityName: city?.name ?? "—",
      sponsor,
      sponsored: all.filter((m) => m.sponsorId === member.id),
      renewalDate: memberRenewalDate(member),
    };
  }
}
