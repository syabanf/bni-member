import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, RefreshCw } from "lucide-react";
import type { Chapter } from "@/domain/entities/Chapter";
import type { ChapterWithStats } from "@/application/dto/ChapterWithStats";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { ChapterFormModal } from "@/presentation/components/master-data/ChapterFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { ChapterDetailModal } from "@/presentation/components/master-data/ChapterDetailModal";

const primaryBtn =
  "flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium";
const ghostBtn =
  "flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium";

export function ChaptersPage() {
  const { listChapters, saveChapter, deleteChapter, listCities } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);

  const { data } = useAsync(() => listChapters.execute(), [refresh]);
  const { data: cityStats } = useAsync(() => listCities.execute(), [refresh]);
  const rows = data ?? [];
  const cityEntities = (cityStats ?? []).map((c) => c.city);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Chapter | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteChapter.execute(deleteTarget.id);
      setDeleteTarget(null);
      bump();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<ChapterWithStats>[] = [
    {
      key: "name",
      header: "Chapter",
      primary: true,
      cell: ({ chapter, cityName }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{chapter.name}</p>
          <p className="text-xs text-gray-500">
            {chapter.code} · {cityName}
          </p>
        </div>
      ),
    },
    {
      key: "meeting",
      header: "Meeting",
      cell: ({ chapter }) => `${chapter.meetingDay}, ${chapter.meetingTime}`,
    },
    { key: "members", header: "Member", cell: (c) => c.memberCount },
    { key: "status", header: "Status", cell: ({ chapter }) => <StatusBadge status={chapter.status} /> },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: ({ chapter }) => (
        <div className="flex items-center gap-1">
          <IconButton label={`Detail ${chapter.name}`} onClick={() => setDetailId(chapter.id)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Edit ${chapter.name}`}
            onClick={() => {
              setEditing(chapter);
              setModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Hapus ${chapter.name}`}
            tone="danger"
            onClick={() => setDeleteTarget(chapter)}
          >
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
        title="Master Chapter"
        description="Tambah, edit, atau hapus chapter, lalu buka detail untuk melihat roster & data operasionalnya."
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
              Tambah Chapter
            </button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={({ chapter }) => chapter.id}
        emptyText="Belum ada chapter"
      />

      <ChapterFormModal
        isOpen={modalOpen}
        initial={editing}
        cities={cityEntities}
        onClose={() => setModalOpen(false)}
        onSubmit={async (input) => {
          await saveChapter.execute(input);
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Chapter"
        message={`Yakin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        error={deleteError}
        deleting={deleting}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
      {detailId && (
        <ChapterDetailModal chapterId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
}
