/**
 * Domain entity: an application user. Roles are scoped per chapter (except
 * National Admin, which is org-wide).
 */
export type UserRole =
  | "National Admin"
  | "Chapter President"
  | "Vice President"
  | "Secretary/Treasurer"
  | "Member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  /** Chapter the role is scoped to (absent for National Admin). */
  chapterId?: string;
  chapterName?: string;
}

export function isNationalAdmin(user: User | null | undefined): boolean {
  return user?.role === "National Admin";
}
