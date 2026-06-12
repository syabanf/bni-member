import { useState } from "react";
import { Plus, Download, Search } from "lucide-react";
import type { Member, MemberStatus } from "@/domain/entities/Member";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { MembersTable } from "@/presentation/components/members/MembersTable";
import { MemberFormModal } from "@/presentation/components/members/MemberFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { MemberDetailModal } from "@/presentation/components/members/MemberDetailModal";

const CHAPTERS = ["All", "Grow", "Rise", "Amplify", "Glorify", "Magnify", "Garuda"];
const STATUSES: (MemberStatus | "All")[] = ["All", "Active", "Pending", "Overdue", "Expired"];

export function AllMembersPage() {
  const { getMembers, listChapters, saveMember, deleteMember } = useServices();

  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState("All");
  const [status, setStatus] = useState<MemberStatus | "All">("All");
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);

  const { data: members } = useAsync(
    () => getMembers.execute({ search, chapter, status }),
    [search, chapter, status, refresh],
  );
  const { data: allMembers } = useAsync(() => getMembers.execute({}), [refresh]);
  const { data: chapterStats } = useAsync(() => listChapters.execute(), [refresh]);

  const rows = members ?? [];
  const all = allMembers ?? [];
  const total = all.length;
  const sponsorName = new Map(all.map((m) => [m.id, m.name]));
  const chapterOptions = (chapterStats ?? []).map((c) => ({
    id: c.chapter.id,
    name: c.chapter.name,
  }));

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [detailMemberId, setDetailMemberId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (m: Member) => {
    setEditing(m);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMember.execute(deleteTarget.id);
      setDeleteTarget(null);
      bump();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Member"
        actions={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New Member
          </button>
        }
      />

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              aria-label="Search members"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
            />
          </div>
          <select
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            aria-label="Filter by chapter"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
          >
            {CHAPTERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as MemberStatus | "All")}
            aria-label="Filter by status"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Status" : s}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <MembersTable
        members={rows}
        extraColumns={[
          { header: "Classification", render: (m) => m.classification },
          {
            header: "Sponsor",
            render: (m) => (m.sponsorId ? sponsorName.get(m.sponsorId) ?? "—" : "—"),
          },
        ]}
        renderActions={(m) => (
          <div className="flex gap-2">
            <button
              onClick={() => setDetailMemberId(m.id)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              View
            </button>
            <button
              onClick={() => openEdit(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteTarget(m)}
              className="flex-1 md:flex-none px-3 py-1 text-xs border border-gray-200 rounded-lg text-danger hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-gray-500">
          Showing {rows.length} of {total} members
        </span>
        <div className="flex gap-1">
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-bni-primary text-white rounded-lg">1</button>
          <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
        </div>
      </div>

      <MemberFormModal
        isOpen={formOpen}
        initial={editing}
        chapters={chapterOptions}
        members={all}
        onClose={() => setFormOpen(false)}
        onSubmit={async (input) => {
          await saveMember.execute(input);
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Member"
        message={`Yakin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        error={deleteError}
        deleting={deleting}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />

      {detailMemberId && (
        <MemberDetailModal
          memberId={detailMemberId}
          onClose={() => setDetailMemberId(null)}
        />
      )}
    </div>
  );
}
