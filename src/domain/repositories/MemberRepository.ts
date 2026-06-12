import type { Member, MemberStatus } from "../entities/Member";

/** Filter accepted by {@link MemberRepository.query}. */
export interface MemberFilter {
  search?: string;
  /** Chapter name, or "All" / undefined for no chapter filter. */
  chapter?: string;
  /** Member status, or "All" / undefined for no status filter. */
  status?: MemberStatus | "All";
}

/**
 * Port (interface) for member persistence. The presentation layer depends on
 * this abstraction; concrete adapters live in the infrastructure layer.
 */
export interface MemberRepository {
  getAll(): Promise<Member[]>;
  findByStatus(statuses: MemberStatus[]): Promise<Member[]>;
  query(filter: MemberFilter): Promise<Member[]>;
}
