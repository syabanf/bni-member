import { useEffect, useState } from "react";
import type { Meeting } from "@/domain/entities/Meeting";
import type { SaveMeetingInput } from "@/application/use-cases/SaveMeeting";
import { FormModal } from "@/presentation/components/ui/FormModal";
import { FormField, fieldInputClass } from "@/presentation/components/ui/FormField";

const today = () => new Date().toISOString().slice(0, 10);

interface MeetingFormModalProps {
  isOpen: boolean;
  chapterId: string;
  initial: Meeting | null;
  onClose: () => void;
  onSubmit: (input: SaveMeetingInput) => Promise<void>;
}

export function MeetingFormModal({ isOpen, chapterId, initial, onClose, onSubmit }: MeetingFormModalProps) {
  const [date, setDate] = useState(today());
  const [topic, setTopic] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDate(initial?.date ?? today());
    setTopic(initial?.topic ?? "");
    setAttendeeCount(initial?.attendeeCount ?? 0);
    setVisitorCount(initial?.visitorCount ?? 0);
    setNotes(initial?.notes ?? "");
    setError(null);
  }, [isOpen, initial]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        id: initial?.id,
        chapterId,
        date,
        topic: topic.trim(),
        attendeeCount,
        visitorCount,
        notes: notes.trim() || undefined,
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
      title={initial ? "Edit Meeting" : "Tambah Meeting Mingguan"}
      submitting={submitting}
      error={error}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <FormField label="Topik / Agenda" required>
        <input className={fieldInputClass} value={topic} onChange={(e) => setTopic(e.target.value)} required />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tanggal">
          <input type="date" className={fieldInputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
        <FormField label="Jumlah Hadir (member)">
          <input
            type="number"
            min={0}
            className={fieldInputClass}
            value={attendeeCount}
            onChange={(e) => setAttendeeCount(Number(e.target.value))}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Jumlah Visitor">
          <input
            type="number"
            min={0}
            className={fieldInputClass}
            value={visitorCount}
            onChange={(e) => setVisitorCount(Number(e.target.value))}
          />
        </FormField>
      </div>

      <FormField label="Catatan">
        <input className={fieldInputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </FormField>
    </FormModal>
  );
}
