import type { Visitor } from "@/domain/entities/Visitor";

type VisitorKeyFields = Pick<Visitor, "phone" | "email" | "name">;

/** Identity key for de-duplication: phone first, then email, then name. */
export function visitorKey(v: VisitorKeyFields): string {
  return (v.phone || v.email || v.name).trim().toLowerCase();
}

/** Count distinct visitors by phone/email (falling back to name). */
export function countUniqueVisitors(visitors: VisitorKeyFields[]): number {
  return new Set(visitors.map(visitorKey)).size;
}
