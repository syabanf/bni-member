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

const ROLES: MemberRole[] = ["President", "Vice President", "Secretary/Treasurer", "Member"];
const STATUSES: MemberStatus[] = ["Active", "Pending", "Overdue", "Expired"];

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
  const [subscription, setSubscription] = useState("Basic");
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
    setSubscription(initial?.subscription ?? "Basic");
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
        subscription,
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

  const sponsorOptions = members.filter((m) => m.id !== initial?.id);

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
          <select className={fieldInputClass} value={role} onChange={(e) => setRole(e.target.value as MemberRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Status">
          <select className={fieldInputClass} value={status} onChange={(e) => setStatus(e.target.value as MemberStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal Bergabung">
          <input type="date" className={fieldInputClass} value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
        </FormField>
        <FormField label="Durasi Membership">
          <select
            className={fieldInputClass}
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value))}
          >
            {MEMBERSHIP_DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} bulan
              </option>
            ))}
          </select>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Paket">
          <select className={fieldInputClass} value={subscription} onChange={(e) => setSubscription(e.target.value)}>
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
          </select>
        </FormField>
        <FormField label="Sponsor (diundang oleh)">
          <select className={fieldInputClass} value={sponsorId} onChange={(e) => setSponsorId(e.target.value)}>
            <option value="">— Tanpa sponsor —</option>
            {sponsorOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </FormModal>
  );
}
