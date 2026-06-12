import type { MemberRepository } from "@/domain/repositories/MemberRepository";

/** Deletes a member. */
export class DeleteMember {
  constructor(private readonly members: MemberRepository) {}

  execute(id: string): Promise<void> {
    return this.members.delete(id);
  }
}
