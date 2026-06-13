import { useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { VISITOR_STAGES, type Visitor, type VisitorStatus } from "@/domain/entities/Visitor";
import type { VisitorWithContext } from "@/application/dto/VisitorWithContext";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { VisitorFormModal } from "@/presentation/components/membership/VisitorFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { formatDate } from "@/presentation/utils/format";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";

const primaryBtn =
  "flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium";
const ghostBtn =
  "flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium";

const stageColor: Record<VisitorStatus, string> = {
  Invited: "bg-blue-500",
  Attended: "bg-warning",
  Applied: "bg-bni-primary",
  Member: "bg-success",
  Declined: "bg-gray-400",
};

export function VisitorsPage() {
  const { listVisitors, saveVisitor, deleteVisitor, getMembers, listChapters } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);

  const { data } = useAsync(() => listVisitors.execute(), [refresh]);
  const { data: members } = useAsync(() => getMembers.execute({}), []);
  const { data: chapterStats } = useAsync(() => listChapters.execute(), []);
  const rows = data ?? [];
  const memberList = members ?? [];
  const chapterOptions = (chapterStats ?? []).map((c) => ({ id: c.chapter.id, name: c.chapter.name }));

  const counts = VISITOR_STAGES.map((stage) => ({
    stage,
    count: rows.filter((r) => r.visitor.status === stage).length,
  }));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [chapterFilter, setChapterFilter] = useState(ALL);
  const ql = search.toLowerCase();
  const filtered = rows.filter(
    (r) =>
      (statusFilter === "All" || r.visitor.status === statusFilter) &&
      (chapterFilter === ALL || r.chapterName === chapterFilter) &&
      (r.visitor.name.toLowerCase().includes(ql) ||
        r.visitor.profession.toLowerCase().includes(ql)),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Visitor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Visitor | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteVisitor.execute(deleteTarget.id);
      setDeleteTarget(null);
      bump();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<VisitorWithContext>[] = [
    {
      key: "visitor",
      header: "Visitor",
      primary: true,
      sortValue: ({ visitor }) => visitor.name,
      cell: ({ visitor }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{visitor.name}</p>
          <p className="text-xs text-gray-500">{visitor.profession}</p>
        </div>
      ),
    },
    { key: "invitedBy", header: "Diundang oleh", sortValue: ({ inviterName }) => inviterName, cell: ({ inviterName }) => inviterName },
    { key: "chapter", header: "Chapter", sortValue: ({ chapterName }) => chapterName, cell: ({ chapterName }) => chapterName },
    { key: "date", header: "Tanggal", sortValue: ({ visitor }) => visitor.visitDate, cell: ({ visitor }) => formatDate(visitor.visitDate) },
    { key: "status", header: "Status", sortValue: ({ visitor }) => visitor.status, cell: ({ visitor }) => <StatusBadge status={visitor.status} /> },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: ({ visitor }) => (
        <div className="flex items-center gap-1">
          <IconButton
            label="Edit visitor"
            onClick={() => {
              setEditing(visitor);
              setModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton label="Hapus visitor" tone="danger" onClick={() => setDeleteTarget(visitor)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="BNI Indonesia"
        title="Visitor & Funnel"
        description="Kelola tamu chapter mengikuti funnel keanggotaan BNI: Invited → Attended → Applied → Member."
        actions={
          <>
            <button onClick={bump} className={ghostBtn}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className={primaryBtn}
            >
              <Plus className="w-4 h-4" />
              Tambah Visitor
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {counts.map(({ stage, count }) => (
          <div key={stage} className="bg-white rounded-2xl border border-gray-100/80 shadow-card p-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stageColor[stage]}`} />
              <span className="text-xs text-gray-500">{stage}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
          </div>
        ))}
      </div>

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama / profesi..."
          ariaLabel="Cari visitor"
          className="flex-1"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          ariaLabel="Filter status visitor"
          options={[{ value: "All", label: "Semua Status" }, ...VISITOR_STAGES.map((s) => ({ value: s, label: s }))]}
        />
        <FilterSelect
          value={chapterFilter}
          onChange={setChapterFilter}
          ariaLabel="Filter by chapter"
          options={chapterFilterOptions(chapterOptions.map((c) => c.name))}
        />
      </FilterBar>

      <DataTable columns={columns} rows={filtered} rowKey={({ visitor }) => visitor.id} emptyText="Belum ada visitor" />

      <VisitorFormModal
        isOpen={modalOpen}
        initial={editing}
        members={memberList}
        chapters={chapterOptions}
        onClose={() => setModalOpen(false)}
        onSubmit={async (input) => {
          await saveVisitor.execute(input);
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Visitor"
        message={`Yakin menghapus visitor "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        error={deleteError}
        deleting={deleting}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
