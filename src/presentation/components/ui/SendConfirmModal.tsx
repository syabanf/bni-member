import { X, Send, Mail, AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";

export interface SendRecipient {
  id: string;
  name: string;
  email?: string;
}

interface SendConfirmModalProps {
  isOpen: boolean;
  title: string;
  /** Noun used in "{n} {noun} akan dikirim", e.g. "invoice", "reminder". */
  noun: string;
  recipients: SendRecipient[];
  sending: boolean;
  tone?: "primary" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation dialog for bulk sends. Replaces the ~100-line modal that was
 * copy-pasted across the four payment pages.
 */
export function SendConfirmModal({
  isOpen,
  title,
  noun,
  recipients,
  sending,
  tone = "primary",
  onCancel,
  onConfirm,
}: SendConfirmModalProps) {
  const RecipientIcon = tone === "danger" ? AlertTriangle : Mail;
  const iconWrap =
    tone === "danger"
      ? "bg-danger/10 text-danger"
      : "bg-bni-primary/10 text-bni-primary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !sending && onCancel()}
      closeOnBackdrop={!sending}
      labelledBy="send-confirm-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-modal-in">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 id="send-confirm-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onCancel}
              disabled={sending}
              aria-label="Tutup"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {recipients.length} {noun} akan dikirim
          </p>
        </div>

        <div className="p-6 max-h-80 overflow-y-auto">
          <div className="space-y-3">
            {recipients.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconWrap}`}>
                  <RecipientIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.email || "No email"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button
            onClick={onCancel}
            disabled={sending}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={sending}
            className="flex-1 px-4 py-3 bg-bni-primary text-white rounded-lg font-medium hover:bg-bni-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {sending ? (
              <>
                <Spinner className="w-5 h-5 border-2 border-white/30 border-t-white" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Kirim Semua
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
