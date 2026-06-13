import type { FilterOption } from "@/presentation/components/ui/FilterSelect";

/** Sentinel value for "no filter applied" in filter dropdowns. */
export const ALL = "All";

/**
 * Build the options for a "filter by chapter" dropdown from any iterable of
 * chapter names — de-duplicated, sorted, with an "All chapters" option first.
 */
export function chapterFilterOptions(names: Iterable<string>): FilterOption[] {
  const unique = Array.from(new Set(names))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "id"));
  return [{ value: ALL, label: "Semua Chapter" }, ...unique.map((n) => ({ value: n, label: n }))];
}
