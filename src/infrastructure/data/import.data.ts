import type { ImportRecord } from "@/domain/entities/ImportRecord";

export const importPreviewSeed: ImportRecord[] = [
  { id: "imp001", name: "John Doe", email: "john@example.com", chapter: "Rise", status: "Success", renewalDate: "2024-04-15" },
  { id: "imp002", name: "Jane Smith", email: "jane@example.com", chapter: "Grow", status: "Success", renewalDate: "2024-05-20" },
  { id: "imp003", name: "Bob Johnson", email: "bob@example.com", chapter: "Amplify", status: "Failed", renewalDate: "2024-06-10" },
  { id: "imp004", name: "Alice Brown", email: "alice@example.com", chapter: "Glorify", status: "Success", renewalDate: "2024-07-01" },
  { id: "imp005", name: "Charlie Davis", email: "charlie@example.com", chapter: "Magnify", status: "Success", renewalDate: "2024-08-15" },
  { id: "imp006", name: "Diana Evans", email: "diana@example.com", chapter: "Garuda", status: "Success", renewalDate: "2024-09-20" },
];
