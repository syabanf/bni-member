import { type ReactNode, type FormEvent } from "react";
import { X } from "lucide-react";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";

interface FormModalProps {
  isOpen: boolean;
  title: string;
  submitting: boolean;
  error?: string | null;
  submitLabel?: string;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
}

/** Modal shell wrapping a <form>: header, scrollable body, error, footer. */
export function FormModal({
  isOpen,
  title,
  submitting,
  error,
  submitLabel = "Simpan",
  onClose,
  onSubmit,
  children,
}: FormModalProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !submitting && onClose()}
      closeOnBackdrop={!submitting}
      labelledBy="form-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-in"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 id="form-modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Tutup"
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>

        {error && (
          <div className="px-5 pb-1">
            <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>
          </div>
        )}

        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2.5 bg-bni-primary text-white rounded-lg text-sm font-medium hover:bg-bni-dark flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting && <Spinner className="w-4 h-4 border-2 border-white/30 border-t-white" />}
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
