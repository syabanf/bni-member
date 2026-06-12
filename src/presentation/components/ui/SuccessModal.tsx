import { CheckCircle } from "lucide-react";
import { Modal } from "./Modal";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  subMessage?: string;
  onClose: () => void;
}

export function SuccessModal({
  isOpen,
  message,
  subMessage,
  onClose,
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="success-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 id="success-title" className="text-2xl font-bold text-gray-900 mb-2">
            Berhasil!
          </h2>
          <p className="text-gray-600 mb-2">{message}</p>
          {subMessage && <p className="text-sm text-gray-500">{subMessage}</p>}
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-bni-primary text-white rounded-lg font-medium hover:bg-bni-dark transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
