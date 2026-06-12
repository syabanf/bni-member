/**
 * Domain entity: a chapter visitor (guest) in the membership funnel.
 * BNI joining path: Invited → Attended → Applied → Member (or Declined).
 */
export type VisitorStatus =
  | "Invited"
  | "Attended"
  | "Applied"
  | "Member"
  | "Declined";

export const VISITOR_STAGES: VisitorStatus[] = [
  "Invited",
  "Attended",
  "Applied",
  "Member",
  "Declined",
];

export interface Visitor {
  id: string;
  name: string;
  profession: string;
  company?: string;
  email?: string;
  /** Member who invited / hosted the visitor. */
  invitedById: string;
  /** Target chapter. */
  chapterId: string;
  visitDate: string;
  status: VisitorStatus;
}
