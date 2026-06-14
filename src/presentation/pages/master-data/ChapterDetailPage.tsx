import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Users, CalendarDays, Plus, Pencil, Trash2 } from "lucide-react";
import type { Member } from "@/domain/entities/Member";
import type { Meeting } from "@/domain/entities/Meeting";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { useToast } from "@/presentation/providers/ToastProvider";
import { Breadcrumb } from "@/presentation/components/ui/Breadcrumb";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DetailField } from "@/presentation/components/ui/DetailField";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { Spinner } from "@/presentation/components/ui/Spinner";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { MeetingFormModal } from "@/presentation/components/master-data/MeetingFormModal";
import { memberColumns } from "@/presentation/components/members/memberColumns";
import { formatDate, LONG_DATE } from "@/presentation/utils/format";

const ghostBtn =
  "flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium";

export function ChapterDetailPage() {
  const { chapterId = "" } = useParams();
  const navigate = useNavigate();
  const { getChapterDetail, listMeetings, saveMeeting, deleteMeeting } = useServices();
  const toast = useToast();

  const { data, loading } = useAsync(() => getChapterDetail.execute(chapterId), [chapterId]);
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);
  const { data: meetings } = useAsync(() => listMeetings.execute(chapterId), [chapterId, refresh]);

  const [meetingOpen, setMeetingOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Meeting | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 border-2 border-gray-200 border-t-bni-primary" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="space-y-4">
        <Breadcrumb items={[{ label: "Chapter", to: "/master-data/chapters" }, { label: "Tidak ditemukan" }]} />
        <p className="text-gray-500">Chapter tidak ditemukan.</p>
      </div>
    );
  }

  const { chapter, cityName, members } = data;
  const meetingRows = meetings ?? [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMeeting.execute(deleteTarget.id);
      toast("Meeting dihapus");
      setDeleteTarget(null);
      bump();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal menghapus", "error");
    } finally {
      setDeleting(false);
    }
  };

  const meetingColumns: Column<Meeting>[] = [
    { key: "date", header: "Tanggal", primary: true, sortValue: (m) => m.date, cell: (m) => formatDate(m.date, LONG_DATE) },
    { key: "topic", header: "Topik", sortValue: (m) => m.topic, cell: (m) => m.topic },
    { key: "attendee", header: "Hadir", sortValue: (m) => m.attendeeCount, cell: (m) => m.attendeeCount },
    { key: "visitor", header: "Visitor", sortValue: (m) => m.visitorCount, cell: (m) => m.visitorCount },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: (m) => (
        <div className="flex items-center gap-1">
          <IconButton
            label="Edit meeting"
            onClick={() => {
              setEditingMeeting(m);
              setMeetingOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton label="Hapus meeting" tone="danger" onClick={() => setDeleteTarget(m)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Chapter", to: "/master-data/chapters" }, { label: chapter.name }]} />

      <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white p-6 shadow-card">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-bni-primary/5 blur-3xl"
        />
        <div className="relative flex items-start gap-4">
          <button
            onClick={() => navigate("/master-data/chapters")}
            aria-label="Kembali"
            className="mt-1 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-bni-primary">Master Chapter</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{chapter.name}</h2>
              <StatusBadge status={chapter.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {chapter.code} ·{" "}
              <Link
                to={`/master-data/cities/${chapter.cityId}`}
                className="inline-flex items-center gap-1 font-medium text-bni-primary hover:underline"
              >
                <MapPin className="h-3.5 w-3.5" />
                {cityName}
              </Link>
            </p>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-4">
          <DetailField label="Hari Meeting">{chapter.meetingDay}</DetailField>
          <DetailField label="Jam Meeting">{chapter.meetingTime}</DetailField>
          <DetailField label="Venue">{chapter.venue || "—"}</DetailField>
          <DetailField label="Tanggal Launch">{formatDate(chapter.launchDate, LONG_DATE)}</DetailField>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <CalendarDays className="h-4 w-4 text-bni-primary" />
            Meeting Mingguan ({meetingRows.length})
          </h3>
          <button
            onClick={() => {
              setEditingMeeting(null);
              setMeetingOpen(true);
            }}
            className={ghostBtn}
          >
            <Plus className="h-4 w-4" />
            Tambah Meeting
          </button>
        </div>
        <DataTable
          columns={meetingColumns}
          rows={meetingRows}
          rowKey={(m) => m.id}
          emptyText="Belum ada meeting tercatat"
        />
      </section>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Users className="h-4 w-4 text-bni-primary" />
          Member di {chapter.name} ({members.length})
        </h3>
        <DataTable
          columns={memberColumns as Column<Member>[]}
          rows={members}
          rowKey={(m) => m.id}
          emptyText="Belum ada member di chapter ini"
          pageSize={10}
          onRowClick={(m) => navigate(`/members/${m.id}`)}
        />
      </section>

      <MeetingFormModal
        isOpen={meetingOpen}
        chapterId={chapterId}
        initial={editingMeeting}
        onClose={() => setMeetingOpen(false)}
        onSubmit={async (input) => {
          await saveMeeting.execute(input);
          toast(editingMeeting ? "Meeting diperbarui" : "Meeting ditambahkan");
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Meeting"
        message={`Hapus meeting "${deleteTarget?.topic}"? Tindakan ini tidak dapat dibatalkan.`}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
