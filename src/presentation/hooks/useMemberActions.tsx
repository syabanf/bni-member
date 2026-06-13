import { useState, type ReactNode } from "react";
import type { Member, MemberStatus } from "@/domain/entities/Member";
import type { SaveMemberInput } from "@/application/use-cases/SaveMember";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { useToast } from "@/presentation/providers/ToastProvider";
import { MemberFormModal } from "@/presentation/components/members/MemberFormModal";
import { MemberDetailModal } from "@/presentation/components/members/MemberDetailModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";

const toInput = (m: Member): SaveMemberInput => ({
  id: m.id,
  name: m.name,
  email: m.email,
  phone: m.phone,
  chapterId: m.chapterId,
  classification: m.classification,
  role: m.role,
  status: m.status,
  joinDate: m.joinDate,
  durationMonths: m.durationMonths,
  registrationFee: m.registrationFee,
  membershipFee: m.membershipFee,
  sponsorId: m.sponsorId,
});

/**
 * Shared member row-action handlers (create / edit / detail / delete + status
 * changes) plus the modals they drive. Used by the member list pages so every
 * action button is wired consistently and deletes always confirm.
 */
export function useMemberActions(onChanged: () => void) {
  const { saveMember, deleteMember, listChapters, getMembers } = useServices();
  const toast = useToast();
  const { data: chapterStats } = useAsync(() => listChapters.execute(), []);
  const { data: allMembers } = useAsync(() => getMembers.execute({}), []);
  const chapters = (chapterStats ?? []).map((c) => ({ id: c.chapter.id, name: c.chapter.name }));
  const members = allMembers ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
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
  const openDetail = (m: Member) => setDetailId(m.id);
  const askDelete = (m: Member) => setDeleteTarget(m);

  /** Update a member's status (Approve / Restore / Renew) with toast feedback. */
  const setStatus = async (m: Member, status: MemberStatus, note: string) => {
    try {
      await saveMember.execute({ ...toInput(m), status });
      toast(`${m.name} ${note}`);
      onChanged();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Gagal memperbarui", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteMember.execute(deleteTarget.id);
      toast(`${deleteTarget.name} dihapus`);
      setDeleteTarget(null);
      onChanged();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const modals: ReactNode = (
    <>
      <MemberFormModal
        isOpen={formOpen}
        initial={editing}
        chapters={chapters}
        members={members}
        onClose={() => setFormOpen(false)}
        onSubmit={async (input) => {
          await saveMember.execute(input);
          toast(editing ? "Member diperbarui" : "Member ditambahkan");
          onChanged();
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
      {detailId && <MemberDetailModal memberId={detailId} onClose={() => setDetailId(null)} />}
    </>
  );

  return { openCreate, openEdit, openDetail, askDelete, setStatus, modals };
}
