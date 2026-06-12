import type {
  MemberRepository,
  MemberFilter,
} from "@/domain/repositories/MemberRepository";
import type { Member } from "@/domain/entities/Member";

/** Returns members matching an optional search / chapter / status filter. */
export class GetMembers {
  constructor(private readonly members: MemberRepository) {}

  execute(filter: MemberFilter = {}): Promise<Member[]> {
    return this.members.query(filter);
  }
}
