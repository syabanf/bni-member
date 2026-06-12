import { useEffect, useState } from "react";
import type { City } from "@/domain/entities/City";
import type { Chapter, ChapterStatus } from "@/domain/entities/Chapter";
import type { SaveChapterInput } from "@/application/use-cases/SaveChapter";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";

const MEETING_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

interface ChapterFormModalProps {
  isOpen: boolean;
  initial: Chapter | null;
  cities: City[];
  onClose: () => void;
  onSubmit: (input: SaveChapterInput) => Promise<void>;
}

export function ChapterFormModal({ isOpen, initial, cities, onClose, onSubmit }: ChapterFormModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [cityId, setCityId] = useState("");
  const [status, setStatus] = useState<ChapterStatus>("Active");
  const [meetingDay, setMeetingDay] = useState("Selasa");
  const [meetingTime, setMeetingTime] = useState("07:00");
  const [venue, setVenue] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name ?? "");
    setCode(initial?.code ?? "");
    setCityId(initial?.cityId ?? cities[0]?.id ?? "");
    setStatus(initial?.status ?? "Active");
    setMeetingDay(initial?.meetingDay ?? "Selasa");
    setMeetingTime(initial?.meetingTime ?? "07:00");
    setVenue(initial?.venue ?? "");
    setLaunchDate(initial?.launchDate ?? new Date().toISOString().slice(0, 10));
    setError(null);
  }, [isOpen, initial, cities]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        name: name.trim(),
        code: code.trim(),
        cityId,
        status,
        meetingDay,
        meetingTime,
        venue: venue.trim(),
        launchDate,
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
      title={initial ? "Edit Chapter" : "Tambah Chapter"}
      submitting={submitting}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nama Chapter" required>
          <input className={fieldInputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Kode" required>
          <input className={fieldInputClass} value={code} onChange={(e) => setCode(e.target.value)} required />
        </FormField>
      </div>
      <FormField label="Kota" required>
        <select className={fieldInputClass} value={cityId} onChange={(e) => setCityId(e.target.value)} required>
          <option value="" disabled>
            Pilih kota
          </option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Hari Meeting">
          <select className={fieldInputClass} value={meetingDay} onChange={(e) => setMeetingDay(e.target.value)}>
            {MEETING_DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Jam Meeting">
          <input type="time" className={fieldInputClass} value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
        </FormField>
      </div>
      <FormField label="Venue">
        <input className={fieldInputClass} value={venue} onChange={(e) => setVenue(e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal Launch">
          <input type="date" className={fieldInputClass} value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} />
        </FormField>
        <FormField label="Status">
          <select className={fieldInputClass} value={status} onChange={(e) => setStatus(e.target.value as ChapterStatus)}>
            <option value="Active">Active</option>
            <option value="Forming">Forming</option>
            <option value="Inactive">Inactive</option>
          </select>
        </FormField>
      </div>
    </FormModal>
  );
}
