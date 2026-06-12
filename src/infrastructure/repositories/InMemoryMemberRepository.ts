import type {
  MemberRepository,
  MemberFilter,
} from "@/domain/repositories/MemberRepository";
import type { Member, MemberStatus } from "@/domain/entities/Member";
import { membersSeed } from "../data/members.data";

/** In-memory adapter for {@link MemberRepository}. */
export class InMemoryMemberRepository implements MemberRepository {
  private readonly members: Member[];

  constructor(seed: Member[] = membersSeed) {
    this.members = seed;
  }

  async getAll(): Promise<Member[]> {
    return [...this.members];
  }

  async findByStatus(statuses: MemberStatus[]): Promise<Member[]> {
    return this.members.filter((m) => statuses.includes(m.status));
  }

  async query(filter: MemberFilter): Promise<Member[]> {
    const search = (filter.search ?? "").trim().toLowerCase();
    return this.members.filter((m) => {
      const matchesSearch =
        !search ||
        m.name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search);
      const matchesChapter =
        !filter.chapter || filter.chapter === "All" || m.chapter === filter.chapter;
      const matchesStatus =
        !filter.status || filter.status === "All" || m.status === filter.status;
      return matchesSearch && matchesChapter && matchesStatus;
    });
  }
}
