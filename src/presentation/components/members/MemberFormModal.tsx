import { useEffect, useState } from "react";
import {
  type Member,
  type MemberRole,
  type MemberStatus,
  MEMBERSHIP_DURATIONS,
} from "@/domain/entities/Member";
import type { SaveMemberInput } from "@/application/use-cases/SaveMember";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";
import { Select } from "@/presentation/components/ui/Select";

const ROLE_OPTIONS = ["President", "Vice President", "Secretary/Treasurer", "Member"].map((r) => ({
  value: r,
  label: r,
}));
const STATUS_OPTIONS = ["Active", "Pending", "Overdue", "Expired"].map((s) => ({ value: s, label: s }));
const TERM_LABEL: Record<number, string> = { 12: "1 Tahun", 24: "2 Tahun", 60: "5 Tahun" };
const DURATION_OPTIONS = MEMBERSHIP_DURATIONS.map((d) => ({
  value: String(d),
  label: TERM_LABEL[d] ?? `${d} bulan`,
}));

interface ChapterOption {
  id: string;
  name: string;
}

interface MemberFormModalProps {
  isOpen: boolean;
  initial: Member | null;
  chapters: ChapterOption[];
  /** All members, used to populate the sponsor picker. */
  members: Member[];
  onClose: () => void;
  onSubmit: (input: SaveMemberInput) => Promise<void>;
}

const today = () => new Date().toISOString().slice(0, 10);

export function MemberFormModal({
  isOpen,
  initial,
  chapters,
  members,
  onClose,
  onSubmit,
}: MemberFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [classification, setClassification] = useState("");
  const [role, setRole] = useState<MemberRole>("Member");
  const [status, setStatus] = useState<MemberStatus>("Active");
  const [joinDate, setJoinDate] = useState(today());
  const [durationMonths, setDurationMonths] = useState(12);
  const [registrationFee, setRegistrationFee] = useState(2_500_000);
  const [membershipFee, setMembershipFee] = useState(8_500_000);
  const [sponsorId, setSponsorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setChapterId(initial?.chapterId ?? chapters[0]?.id ?? "");
    setClassification(initial?.classification ?? "");
    setRole(initial?.role ?? "Member");
    setStatus(initial?.status ?? "Active");
    setJoinDate(initial?.joinDate ?? today());
    setDurationMonths(initial?.durationMonths ?? 12);
    setRegistrationFee(initial?.registrationFee ?? 2_500_000);
    setMembershipFee(initial?.membershipFee ?? 8_500_000);
    setSponsorId(initial?.sponsorId ?? "");
    setError(null);
  }, [isOpen, initial, chapters]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        name: name.trim(),
        email: email.trim(),
        chapterId,
        classification: classification.trim(),
        role,
        status,
        joinDate,
        durationMonths,
        registrationFee,
        membershipFee,
        sponsorId: sponsorId || undefined,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  const sponsorOptions = [
    { value: "", label: "— Tanpa sponsor —" },
    ...members.filter((m) => m.id !== initial?.id).map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <FormModal
      isOpen={isOpen}
      title={initial ? "Edit Member" : "Tambah Member"}
      submitting={submitting}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nama" required>
          <input className={fieldInputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Email" required>
          <input type="email" className={fieldInputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Chapter" required>
          <Select
            value={chapterId}
            onChange={setChapterId}
            options={chapters.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Pilih chapter"
            ariaLabel="Chapter"
          />
        </FormField>
        <FormField label="Klasifikasi (profesi)" required>
          <input
            className={fieldInputClass}
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            placeholder="mis. Akuntan"
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Role">
          <Select value={role} onChange={(v) => setRole(v as MemberRole)} options={ROLE_OPTIONS} ariaLabel="Role" />
        </FormField>
        <FormField label="Status">
          <Select value={status} onChange={(v) => setStatus(v as MemberStatus)} options={STATUS_OPTIONS} ariaLabel="Status" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal Bergabung">
          <input type="date" className={fieldInputClass} value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
        </FormField>
        <FormField label="Paket Membership">
          <Select
            value={String(durationMonths)}
            onChange={(v) => setDurationMonths(Number(v))}
            options={DURATION_OPTIONS}
            ariaLabel="Paket membership"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Biaya Pendaftaran (Rp)">
          <input
            type="number"
            min={0}
            className={fieldInputClass}
            value={registrationFee}
            onChange={(e) => setRegistrationFee(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Biaya Membership / thn (Rp)">
          <input
            type="number"
            min={0}
            className={fieldInputClass}
            value={membershipFee}
            onChange={(e) => setMembershipFee(Number(e.target.value))}
          />
        </FormField>
      </div>

      <FormField label="Sponsor (diundang oleh)">
        <Select value={sponsorId} onChange={setSponsorId} options={sponsorOptions} ariaLabel="Sponsor" />
      </FormField>
    </FormModal>
  );
}
