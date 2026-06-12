import { useEffect, useState } from "react";
import type { Member } from "@/domain/entities/Member";
import type { Referral, ReferralStatus, ReferralTier } from "@/domain/entities/Referral";
import type { SaveReferralInput } from "@/application/use-cases/SaveReferral";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";

const TIERS: ReferralTier[] = ["Inside", "Outside"];
const STATUSES: ReferralStatus[] = ["Open", "In Progress", "Closed", "Cancelled"];
const today = () => new Date().toISOString().slice(0, 10);

interface ReferralFormModalProps {
  isOpen: boolean;
  initial: Referral | null;
  members: Member[];
  onClose: () => void;
  onSubmit: (input: SaveReferralInput) => Promise<void>;
}

export function ReferralFormModal({
  isOpen,
  initial,
  members,
  onClose,
  onSubmit,
}: ReferralFormModalProps) {
  const [fromMemberId, setFrom] = useState("");
  const [toMemberId, setTo] = useState("");
  const [date, setDate] = useState(today());
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState<ReferralTier>("Inside");
  const [status, setStatus] = useState<ReferralStatus>("Open");
  const [tyfcb, setTyfcb] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFrom(initial?.fromMemberId ?? members[0]?.id ?? "");
    setTo(initial?.toMemberId ?? "");
    setDate(initial?.date ?? today());
    setDescription(initial?.description ?? "");
    setTier(initial?.tier ?? "Inside");
    setStatus(initial?.status ?? "Open");
    setTyfcb(initial?.tyfcb ?? 0);
    setError(null);
  }, [isOpen, initial, members]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        fromMemberId,
        toMemberId,
        date,
        description: description.trim(),
        tier,
        status,
        tyfcb,
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
      title={initial ? "Edit Referral" : "Tambah Referral"}
      submitting={submitting}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Dari (pemberi)" required>
          <select className={fieldInputClass} value={fromMemberId} onChange={(e) => setFrom(e.target.value)} required>
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
        <FormField label="Ke (penerima)" required>
          <select className={fieldInputClass} value={toMemberId} onChange={(e) => setTo(e.target.value)} required>
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
      </div>

      <FormField label="Deskripsi" required>
        <input
          className={fieldInputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="mis. Audit keuangan PT Maju Jaya"
          required
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal">
          <input type="date" className={fieldInputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
        <FormField label="Tier">
          <select className={fieldInputClass} value={tier} onChange={(e) => setTier(e.target.value as ReferralTier)}>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t === "Inside" ? "Inside (RGI)" : "Outside (RGO)"}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Status">
          <select className={fieldInputClass} value={status} onChange={(e) => setStatus(e.target.value as ReferralStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="TYFCB (Rp) — saat Closed">
          <input
            type="number"
            min={0}
            className={fieldInputClass}
            value={tyfcb}
            onChange={(e) => setTyfcb(Number(e.target.value))}
            disabled={status !== "Closed"}
          />
        </FormField>
      </div>
    </FormModal>
  );
}
