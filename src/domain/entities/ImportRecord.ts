/**
 * Domain entity: one row of an imported member spreadsheet preview.
 */
export type ImportStatus = "Success" | "Failed";

export interface ImportRecord {
  id: string;
  name: string;
  email: string;
  chapter: string;
  status: ImportStatus;
  renewalDate: string;
}
