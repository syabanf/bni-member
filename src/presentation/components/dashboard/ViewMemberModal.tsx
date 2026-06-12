import { X } from "lucide-react";
import type { PaymentRecord } from "@/domain/entities/Payment";
import { Modal } from "@/presentation/components/ui/Modal";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { formatCurrency, formatDate, LONG_DATE } from "@/presentation/utils/format";

interface ViewMemberModalProps {
  data: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewMemberModal({ data, isOpen, onClose }: ViewMemberModalProps) {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="view-member-title">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 id="view-member-title" className="text-lg font-semibold text-gray-900">
            Detail Member
          </h3>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary text-2xl font-bold">
              {data.memberName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{data.memberName}</h4>
              <p className="text-sm text-gray-500">ID: {data.memberId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Chapter</p>
                <p className="text-sm font-medium text-gray-900">{data.chapter}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <StatusBadge status={data.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Status</p>
                <StatusBadge status={data.paymentStatus} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(data.date, LONG_DATE)}
                </p>
              </div>
            </div>

            {data.amount && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Amount</p>
                <p className="text-lg font-bold text-bni-primary">
                  {formatCurrency(data.amount)}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Activity Timeline
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-success mt-1.5" />
                  <div>
                    <p className="text-sm text-gray-900">Member Registration</p>
                    <p className="text-xs text-gray-500">Joined as {data.chapter} member</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-warning mt-1.5" />
                  <div>
                    <p className="text-sm text-gray-900">Payment {data.paymentStatus}</p>
                    <p className="text-xs text-gray-500">{formatDate(data.date, LONG_DATE)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
          <button className="flex-1 px-4 py-2 bg-bni-primary hover:bg-bni-dark text-white rounded-lg text-sm font-medium">
            Edit Member
          </button>
        </div>
      </div>
    </Modal>
  );
}
