import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { Member } from "@/domain/entities/Member";
import { VISITOR_STAGES, type Visitor, type VisitorStatus } from "@/domain/entities/Visitor";
import type { SaveVisitorInput } from "@/application/use-cases/SaveVisitor";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";
import { Select } from "@/presentation/components/ui/Select";

const STATUS_OPTIONS = VISITOR_STAGES.map((s) => ({ value: s, label: s }));
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
  const [phone, setPhone] = useState("");
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
    setPhone(initial?.phone ?? "");
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
        phone: phone.trim() || undefined,
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

  const seatTakenBy = profession.trim()
    ? members.find(
        (m) =>
          m.chapterId === chapterId &&
          m.status === "Active" &&
          m.classification.trim().toLowerCase() === profession.trim().toLowerCase(),
      )
    : undefined;
  const chapterName = chapters.find((c) => c.id === chapterId)?.name ?? "chapter ini";

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
        <FormField label="Profesi (tipe bisnis)" required>
          <input className={fieldInputClass} value={profession} onChange={(e) => setProfession(e.target.value)} required />
        </FormField>
      </div>

      {seatTakenBy && (
        <div className="flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2 text-sm text-warning">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Kursi profesi <b>"{profession.trim()}"</b> di {chapterName} sudah terisi oleh{" "}
            <b>{seatTakenBy.name}</b>. BNI hanya menerima 1 profesi per chapter.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Perusahaan">
          <input className={fieldInputClass} value={company} onChange={(e) => setCompany(e.target.value)} />
        </FormField>
        <FormField label="Email">
          <input type="email" className={fieldInputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
      </div>

      <FormField label="No. WhatsApp">
        <input
          className={fieldInputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          inputMode="tel"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Diundang oleh" required>
          <Select
            value={invitedById}
            onChange={setInvitedBy}
            options={members.map((m) => ({ value: m.id, label: m.name }))}
            placeholder="Pilih member"
            ariaLabel="Diundang oleh"
          />
        </FormField>
        <FormField label="Chapter" required>
          <Select
            value={chapterId}
            onChange={setChapterId}
            options={chapters.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Pilih chapter"
            ariaLabel="Chapter"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal Kunjungan">
          <input type="date" className={fieldInputClass} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
        </FormField>
        <FormField label="Status">
          <Select value={status} onChange={(v) => setStatus(v as VisitorStatus)} options={STATUS_OPTIONS} ariaLabel="Status visitor" />
        </FormField>
      </div>
    </FormModal>
  );
}
