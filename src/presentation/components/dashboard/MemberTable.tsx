import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import type { PaymentRecord } from "@/domain/entities/Payment";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { ViewMemberModal } from "./ViewMemberModal";
import { formatDate, SHORT_DATE } from "@/presentation/utils/format";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";

interface MemberTableProps {
  data: PaymentRecord[];
  title?: string;
  /** When set, renders a "Lihat semua" drill-down link in the header. */
  viewAllTo?: string;
}

export function MemberTable({
  data,
  title = "Recent Member Activity",
  viewAllTo,
}: MemberTableProps) {
  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState(ALL);
  const [selected, setSelected] = useState<PaymentRecord | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = data.filter(
    (r) =>
      (chapter === ALL || r.chapter === chapter) &&
      (r.memberName.toLowerCase().includes(search.toLowerCase()) ||
        r.chapter.toLowerCase().includes(search.toLowerCase()) ||
        r.status.toLowerCase().includes(search.toLowerCase())),
  );

  const view = (record: PaymentRecord) => {
    setSelected(record);
    setIsOpen(true);
  };

  const columns: Column<PaymentRecord>[] = [
    {
      key: "name",
      header: "Name",
      primary: true,
      sortValue: (r) => r.memberName,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary text-sm font-medium">
            {r.memberName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{r.memberName}</p>
            <p className="text-xs text-gray-500">{r.memberId}</p>
          </div>
        </div>
      ),
    },
    { key: "chapter", header: "Chapter", sortValue: (r) => r.chapter, cell: (r) => r.chapter },
    { key: "status", header: "Status", sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    { key: "payment", header: "Payment", sortValue: (r) => r.paymentStatus, cell: (r) => <StatusBadge status={r.paymentStatus} /> },
    { key: "date", header: "Date", sortValue: (r) => r.date, cell: (r) => formatDate(r.date, SHORT_DATE) },
    {
      key: "actions",
      header: "Actions",
      actions: true,
      cell: (r) => (
        <div className="flex items-center gap-1">
          <IconButton label={`View ${r.memberName}`} onClick={() => view(r)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton label={`Edit ${r.memberName}`}>
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton label={`Delete ${r.memberName}`} tone="danger">
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(r) => r.id}
        emptyText="No data found"
        header={
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {viewAllTo && (
                <Link
                  to={viewAllTo}
                  className="inline-flex items-center gap-0.5 text-sm font-medium text-bni-primary hover:underline"
                >
                  Lihat semua
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <SearchInput
                value={search}
                onChange={setSearch}
                ariaLabel="Search records"
                className="w-full sm:w-56"
              />
              <FilterSelect
                value={chapter}
                onChange={setChapter}
                ariaLabel="Filter by chapter"
                options={chapterFilterOptions(data.map((r) => r.chapter))}
              />
            </div>
          </div>
        }
        footer={
          <span className="text-sm text-gray-500">
            Showing {filtered.length} of {data.length} records
          </span>
        }
      />
      <ViewMemberModal
        data={selected}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelected(null);
        }}
      />
    </>
  );
}
