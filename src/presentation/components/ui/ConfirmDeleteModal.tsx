import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  error?: string | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  message,
  error,
  deleting,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !deleting && onCancel()}
      closeOnBackdrop={!deleting}
      labelledBy="confirm-delete-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <h2 id="confirm-delete-title" className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h2>
          <p className="text-sm text-gray-500">{message}</p>
          {error && (
            <p className="mt-3 text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {deleting && <Spinner className="w-4 h-4 border-2 border-white/30 border-t-white" />}
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}
