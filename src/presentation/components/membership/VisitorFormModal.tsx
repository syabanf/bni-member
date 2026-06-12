import { useEffect, useState } from "react";
import type { Member } from "@/domain/entities/Member";
import { VISITOR_STAGES, type Visitor, type VisitorStatus } from "@/domain/entities/Visitor";
import type { SaveVisitorInput } from "@/application/use-cases/SaveVisitor";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";

const today = () => new Date().toISOString().slice(0, 10);

interface ChapterOption {
  id: string;
  name: string;
}

interface VisitorFormModalProps {
  isOpen: boolean;
  initial: Visitor | null;
  members: Member[];
  chapters: ChapterOption[];
  onClose: () => void;
  onSubmit: (input: SaveVisitorInput) => Promise<void>;
}

export function VisitorFormModal({
  isOpen,
  initial,
  members,
  chapters,
  onClose,
  onSubmit,
}: VisitorFormModalProps) {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [invitedById, setInvitedBy] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [visitDate, setVisitDate] = useState(today());
  const [status, setStatus] = useState<VisitorStatus>("Invited");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name ?? "");
    setProfession(initial?.profession ?? "");
    setCompany(initial?.company ?? "");
    setEmail(initial?.email ?? "");
    setInvitedBy(initial?.invitedById ?? members[0]?.id ?? "");
    setChapterId(initial?.chapterId ?? chapters[0]?.id ?? "");
    setVisitDate(initial?.visitDate ?? today());
    setStatus(initial?.status ?? "Invited");
    setError(null);
  }, [isOpen, initial, members, chapters]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        name: name.trim(),
        profession: profession.trim(),
        company: company.trim() || undefined,
        email: email.trim() || undefined,
        invitedById,
        chapterId,
        visitDate,
        status,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      title={initial ? "Edit Visitor" : "Tambah Visitor"}
      submitting={submitting}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nama" required>
          <input className={fieldInputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Profesi" required>
          <input className={fieldInputClass} value={profession} onChange={(e) => setProfession(e.target.value)} required />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Perusahaan">
          <input className={fieldInputClass} value={company} onChange={(e) => setCompany(e.target.value)} />
        </FormField>
        <FormField label="Email">
          <input type="email" className={fieldInputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Diundang oleh" required>
          <select className={fieldInputClass} value={invitedById} onChange={(e) => setInvitedBy(e.target.value)} required>
            <option value="" disabled>
              Pilih member
            </option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Chapter" required>
          <select className={fieldInputClass} value={chapterId} onChange={(e) => setChapterId(e.target.value)} required>
            <option value="" disabled>
              Pilih chapter
            </option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal Kunjungan">
          <input type="date" className={fieldInputClass} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
        </FormField>
        <FormField label="Status">
          <select className={fieldInputClass} value={status} onChange={(e) => setStatus(e.target.value as VisitorStatus)}>
            {VISITOR_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </FormModal>
  );
}
