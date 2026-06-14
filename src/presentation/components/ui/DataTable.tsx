import { useMemo, useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";

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
  /** When set, rows are paginated client-side (after sorting) with a pager. */
  pageSize?: number;
  /** When set, rows become clickable (cursor + hover) and call this on click. */
  onRowClick?: (row: T) => void;
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
  pageSize,
  onRowClick,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);

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

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(page, pageCount);
  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;

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
                {visible.map((row) => (
                  <tr
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`hover:bg-gray-50/70 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  >
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
            {visible.map((row) => (
              <div
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`p-4 ${onRowClick ? "cursor-pointer active:bg-gray-50" : ""}`}
              >
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

          {pageSize && (
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-t border-gray-100 text-sm">
              <span className="text-gray-500">
                {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, sorted.length)} dari {sorted.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(current - 1)}
                  disabled={current <= 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <span className="px-3 text-gray-500">
                  Hal {current}/{pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(current + 1)}
                  disabled={current >= pageCount}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {footer && <div className="px-5 py-4 border-t border-gray-100">{footer}</div>}
    </div>
  );
}
