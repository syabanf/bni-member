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
 * Port (interface) for member persistence with full CRUD plus the queries the
 * app needs (by status, by chapter, free-text).
 */
export interface MemberRepository {
  getAll(): Promise<Member[]>;
  getById(id: string): Promise<Member | null>;
  getByChapter(chapterId: string): Promise<Member[]>;
  findByStatus(statuses: MemberStatus[]): Promise<Member[]>;
  query(filter: MemberFilter): Promise<Member[]>;
  create(input: Omit<Member, "id">): Promise<Member>;
  update(id: string, input: Omit<Member, "id">): Promise<Member>;
  delete(id: string): Promise<void>;
}
