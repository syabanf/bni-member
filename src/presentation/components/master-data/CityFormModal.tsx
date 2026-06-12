import { useEffect, useState } from "react";
import type { City, CityStatus } from "@/domain/entities/City";
import type { SaveCityInput } from "@/application/use-cases/SaveCity";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";
import { Select } from "@/presentation/components/ui/Select";

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

interface CityFormModalProps {
  isOpen: boolean;
  initial: City | null;
  onClose: () => void;
  onSubmit: (input: SaveCityInput) => Promise<void>;
}

export function CityFormModal({ isOpen, initial, onClose, onSubmit }: CityFormModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [province, setProvince] = useState("");
  const [status, setStatus] = useState<CityStatus>("Active");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name ?? "");
    setCode(initial?.code ?? "");
    setProvince(initial?.province ?? "");
    setStatus(initial?.status ?? "Active");
    setError(null);
  }, [isOpen, initial]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        name: name.trim(),
        code: code.trim(),
        province: province.trim(),
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
      title={initial ? "Edit Kota" : "Tambah Kota"}
      submitting={submitting}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField label="Nama Kota" required>
        <input className={fieldInputClass} value={name} onChange={(e) => setName(e.target.value)} required />
      </FormField>
      <FormField label="Kode" required>
        <input className={fieldInputClass} value={code} onChange={(e) => setCode(e.target.value)} required />
      </FormField>
      <FormField label="Provinsi" required>
        <input className={fieldInputClass} value={province} onChange={(e) => setProvince(e.target.value)} required />
      </FormField>
      <FormField label="Status">
        <Select
          value={status}
          onChange={(v) => setStatus(v as CityStatus)}
          options={STATUS_OPTIONS}
          ariaLabel="Status kota"
        />
      </FormField>
    </FormModal>
  );
}
