import type { MemberRepository } from "@/domain/repositories/MemberRepository";
import type { Member, MemberStatus } from "@/domain/entities/Member";

/** Returns members in any of the given statuses. */
export class GetMembersByStatus {
  constructor(private readonly members: MemberRepository) {}

  execute(statuses: MemberStatus[]): Promise<Member[]> {
    return this.members.findByStatus(statuses);
  }
}
