import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, ArrowUpRight, MessageCircle } from "lucide-react";
import type { PaymentRecord } from "@/domain/entities/Payment";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { formatDate, SHORT_DATE } from "@/presentation/utils/format";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";
import { waLink } from "@/presentation/utils/whatsapp";
import { useToast } from "@/presentation/providers/ToastProvider";

interface MemberTableProps {
  data: PaymentRecord[];
  title?: string;
  /** When set, renders a "Lihat semua" drill-down link in the header. */
  viewAllTo?: string;
  /** When set, each row gets a WhatsApp reminder button using this autotext. */
  waText?: (record: PaymentRecord) => string;
}

export function MemberTable({
  data,
  title = "Recent Member Activity",
  viewAllTo,
  waText,
}: MemberTableProps) {
  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState(ALL);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<PaymentRecord | null>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const filtered = data.filter(
    (r) =>
      !removedIds.includes(r.id) &&
      (chapter === ALL || r.chapter === chapter) &&
      (r.memberName.toLowerCase().includes(search.toLowerCase()) ||
        r.chapter.toLowerCase().includes(search.toLowerCase()) ||
        r.status.toLowerCase().includes(search.toLowerCase())),
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRemovedIds((ids) => [...ids, deleteTarget.id]);
    toast(`Data ${deleteTarget.memberName} dihapus`);
    setDeleteTarget(null);
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
          {waText && r.phone && (
            <a
              href={waLink(r.phone, waText(r))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ingatkan ${r.memberName} via WhatsApp`}
              title="Ingatkan via WhatsApp"
              className="p-1.5 rounded-lg text-gray-500 hover:bg-success/10 hover:text-success"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          <IconButton label={`View ${r.memberName}`} onClick={() => navigate(`/members/${r.memberId}`)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Edit ${r.memberName}`}
            onClick={() => toast("Edit data pembayaran belum tersedia", "info")}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton label={`Delete ${r.memberName}`} tone="danger" onClick={() => setDeleteTarget(r)}>
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
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Data"
        message={`Hapus data pembayaran "${deleteTarget?.memberName}"?`}
        deleting={false}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
