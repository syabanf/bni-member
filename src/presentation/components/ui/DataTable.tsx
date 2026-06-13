import { useMemo, useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Mobile: render as the card's prominent header (no label). */
  primary?: boolean;
  /** Mobile: render in the actions row at the bottom (no label). */
  actions?: boolean;
  align?: "left" | "right";
  /**
   * When set, the column header becomes clickable to sort by the returned
   * scalar. Clicking cycles ascending → descending → unsorted.
   */
  sortValue?: (row: T) => string | number | null | undefined;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
  /** Optional content rendered above the table, inside the card. */
  header?: ReactNode;
  /** Optional content rendered below the table, inside the card. */
  footer?: ReactNode;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

/** Compare two sort values; null/empty always sort last, strings use locale + numeric. */
function compareValues(a: string | number | null | undefined, b: string | number | null | undefined): number {
  const na = a == null || a === "";
  const nb = b == null || b === "";
  if (na && nb) return 0;
  if (na) return 1;
  if (nb) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "id", { numeric: true });
}

/**
 * Standardised responsive table: a desktop table and auto-generated mobile
 * cards from the same column config. Header background, cell padding, row
 * dividers, hover, and empty state are consistent everywhere it is used.
 *
 * Columns that declare a `sortValue` get a clickable, sortable header.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = "Tidak ada data",
  header,
  footer,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);

  const sortCol = sort ? columns.find((c) => c.key === sort.key) : undefined;
  const sorted = useMemo(() => {
    if (!sort || !sortCol?.sortValue) return rows;
    const get = sortCol.sortValue;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => compareValues(get(a), get(b)) * dir);
  }, [rows, sort, sortCol]);

  const toggleSort = (key: string) =>
    setSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: "asc" };
      if (cur.dir === "asc") return { key, dir: "desc" };
      return null;
    });

  const primaryCols = columns.filter((c) => c.primary);
  const actionCols = columns.filter((c) => c.actions);
  const fieldCols = columns.filter((c) => !c.primary && !c.actions);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 overflow-hidden">
      {header && <div className="p-5 border-b border-gray-100">{header}</div>}

      {rows.length === 0 ? (
        <div className="p-8 text-center text-gray-500">{emptyText}</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  {columns.map((c) => {
                    const alignRight = c.align === "right";
                    const active = sort?.key === c.key;
                    return (
                      <th
                        key={c.key}
                        className={`px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${
                          alignRight ? "text-right" : "text-left"
                        }`}
                      >
                        {c.sortValue ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(c.key)}
                            aria-label={`Urutkan berdasarkan ${c.header}`}
                            className={`group inline-flex items-center gap-1 transition-colors hover:text-gray-700 ${
                              alignRight ? "flex-row-reverse" : ""
                            } ${active ? "text-gray-700" : ""}`}
                          >
                            <span>{c.header}</span>
                            {active ? (
                              sort?.dir === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400" />
                            )}
                          </button>
                        ) : (
                          c.header
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map((row) => (
                  <tr key={rowKey(row)} className="hover:bg-gray-50/70 transition-colors">
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`px-5 py-4 text-sm text-gray-600 align-middle ${
                          c.align === "right" ? "text-right" : ""
                        }`}
                      >
                        {c.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {sorted.map((row) => (
              <div key={rowKey(row)} className="p-4">
                {primaryCols.length > 0 && (
                  <div className="mb-3">
                    {primaryCols.map((c) => (
                      <div key={c.key}>{c.cell(row)}</div>
                    ))}
                  </div>
                )}
                {fieldCols.length > 0 && (
                  <div className="space-y-2">
                    {fieldCols.map((c) => (
                      <div key={c.key} className="flex justify-between gap-3">
                        <span className="text-xs text-gray-500 uppercase">{c.header}</span>
                        <span className="text-sm text-gray-900 text-right">{c.cell(row)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {actionCols.length > 0 && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    {actionCols.map((c) => (
                      <div key={c.key} className="flex-1">
                        {c.cell(row)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {footer && <div className="px-5 py-4 border-t border-gray-100">{footer}</div>}
    </div>
  );
}
