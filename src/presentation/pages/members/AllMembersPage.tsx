import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";
import type { Member, MemberStatus } from "@/domain/entities/Member";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { MembersTable } from "@/presentation/components/members/MembersTable";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect, type FilterOption } from "@/presentation/components/ui/FilterSelect";
import { MemberFormModal } from "@/presentation/components/members/MemberFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { chapterFilterOptions, ALL } from "@/presentation/utils/filters";
import { exportToCsv } from "@/presentation/utils/csv";
import { useToast } from "@/presentation/providers/ToastProvider";

const STATUS_OPTIONS: FilterOption[] = ["All", "Active", "Pending", "Overdue", "Expired"].map(
  (s) => ({ value: s, label: s === "All" ? "All Status" : s }),
);

export function AllMembersPage() {
  const { getMembers, listChapters, saveMember, deleteMember } = useServices();
  const toast = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [chapter, setChapter] = useState(ALL);
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
  const chapterSelectOptions = chapterFilterOptions(chapterOptions.map((c) => c.name));

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const handleExport = () => {
    exportToCsv("members.csv", rows, [
      { header: "Nama", value: (m) => m.name },
      { header: "Email", value: (m) => m.email },
      { header: "Chapter", value: (m) => m.chapter },
      { header: "Klasifikasi", value: (m) => m.classification },
      { header: "Role", value: (m) => m.role },
      { header: "Status", value: (m) => m.status },
      { header: "Tanggal Gabung", value: (m) => m.joinDate },
      { header: "Paket", value: (m) => m.subscription },
    ]);
    toast(`${rows.length} member diekspor ke CSV`);
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

      <SummaryCards
        items={[
          { iconName: "Users", value: total, label: "Total Member", color: "blue" },
          { iconName: "UserCheck", value: all.filter((m) => m.status === "Active").length, label: "Active", color: "green" },
          { iconName: "Clock", value: all.filter((m) => m.status === "Pending").length, label: "Pending", color: "amber" },
          { iconName: "AlertTriangle", value: all.filter((m) => m.status === "Overdue").length, label: "Overdue", color: "red" },
        ]}
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
          ariaLabel="Search members"
          className="flex-1"
        />
        <FilterSelect
          value={chapter}
          onChange={setChapter}
          ariaLabel="Filter by chapter"
          options={chapterSelectOptions}
        />
        <FilterSelect
          value={status}
          onChange={(v) => setStatus(v as MemberStatus | "All")}
          ariaLabel="Filter by status"
          options={STATUS_OPTIONS}
        />
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </FilterBar>

      <MembersTable
        members={rows}
        extraColumns={[
          {
            header: "Classification",
            render: (m) => m.classification,
            sortValue: (m) => m.classification,
          },
          {
            header: "Sponsor",
            render: (m) => (m.sponsorId ? sponsorName.get(m.sponsorId) ?? "—" : "—"),
            sortValue: (m) => (m.sponsorId ? sponsorName.get(m.sponsorId) ?? "" : ""),
          },
        ]}
        renderActions={(m) => (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/members/${m.id}`)}
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
        pageSize={10}
      />

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
    </div>
  );
}
