import type {
  MemberRepository,
  MemberFilter,
} from "@/domain/repositories/MemberRepository";
import type { Member, MemberStatus } from "@/domain/entities/Member";
import { membersSeed } from "../data/members.data";
import { memberStatsSeed } from "../data/memberStats.data";

/** In-memory adapter for {@link MemberRepository}. Mutations persist per session. */
export class InMemoryMemberRepository implements MemberRepository {
  private members: Member[];

  constructor(seed: Member[] = membersSeed) {
    // Merge the PALMS stored stats (1-2-1, CEU, attendance) into each member.
    this.members = seed.map((m) => ({ ...m, ...(memberStatsSeed[m.id] ?? {}) }));
  }

  async getAll(): Promise<Member[]> {
    return this.members.map((m) => ({ ...m }));
  }

  async getById(id: string): Promise<Member | null> {
    const found = this.members.find((m) => m.id === id);
    return found ? { ...found } : null;
  }

  async getByChapter(chapterId: string): Promise<Member[]> {
    return this.members.filter((m) => m.chapterId === chapterId).map((m) => ({ ...m }));
  }

  async findByStatus(statuses: MemberStatus[]): Promise<Member[]> {
    return this.members.filter((m) => statuses.includes(m.status)).map((m) => ({ ...m }));
  }

  async query(filter: MemberFilter): Promise<Member[]> {
    const search = (filter.search ?? "").trim().toLowerCase();
    return this.members
      .filter((m) => {
        const matchesSearch =
          !search ||
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search);
        const matchesChapter =
          !filter.chapter || filter.chapter === "All" || m.chapter === filter.chapter;
        const matchesStatus =
          !filter.status || filter.status === "All" || m.status === filter.status;
        return matchesSearch && matchesChapter && matchesStatus;
      })
      .map((m) => ({ ...m }));
  }

  async create(input: Omit<Member, "id">): Promise<Member> {
    const member: Member = { id: crypto.randomUUID(), ...input };
    this.members.push(member);
    return { ...member };
  }

  async update(id: string, input: Omit<Member, "id">): Promise<Member> {
    const index = this.members.findIndex((m) => m.id === id);
    if (index < 0) throw new Error("Member tidak ditemukan");
    this.members[index] = { id, ...input };
    return { ...this.members[index] };
  }

  async delete(id: string): Promise<void> {
    this.members = this.members.filter((m) => m.id !== id);
  }
}
