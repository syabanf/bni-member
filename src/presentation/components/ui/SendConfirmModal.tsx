import { X, Send, Mail, AlertTriangle, MessageCircle } from "lucide-react";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { waLink } from "@/presentation/utils/whatsapp";

export interface SendRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface SendConfirmModalProps {
  isOpen: boolean;
  title: string;
  /** Noun used in "{n} {noun} akan dikirim", e.g. "invoice", "reminder". */
  noun: string;
  recipients: SendRecipient[];
  sending: boolean;
  tone?: "primary" | "danger";
  /** "email" (bulk send, default) or "whatsapp" (per-recipient wa.me chat links). */
  channel?: "email" | "whatsapp";
  /** Required for the whatsapp channel: builds each recipient's autotext. */
  waText?: (r: SendRecipient) => string;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmation dialog for bulk reminders. The "email" channel sends in bulk;
 * the "whatsapp" channel lists each recipient with a wa.me chat link (autotext
 * pre-filled) since WhatsApp is opened one chat at a time.
 */
export function SendConfirmModal({
  isOpen,
  title,
  noun,
  recipients,
  sending,
  tone = "primary",
  channel = "email",
  waText,
  onCancel,
  onConfirm,
}: SendConfirmModalProps) {
  const isWa = channel === "whatsapp";
  const RecipientIcon = isWa ? MessageCircle : tone === "danger" ? AlertTriangle : Mail;
  const iconWrap = isWa
    ? "bg-success/10 text-success"
    : tone === "danger"
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
            {isWa
              ? `${recipients.length} member · klik Chat untuk kirim reminder via WhatsApp`
              : `${recipients.length} ${noun} akan dikirim`}
          </p>
        </div>

        <div className="p-6 max-h-80 overflow-y-auto">
          <div className="space-y-3">
            {recipients.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconWrap}`}>
                  <RecipientIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {isWa ? r.phone || "Tidak ada nomor" : r.email || "No email"}
                  </p>
                </div>
                {isWa &&
                  (r.phone ? (
                    <a
                      href={waLink(r.phone, waText ? waText(r) : "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          {isWa ? (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-bni-primary text-white rounded-lg font-medium hover:bg-bni-dark transition-colors"
            >
              Selesai
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
