import { X } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { Modal } from "@/presentation/components/ui/Modal";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DetailField } from "@/presentation/components/ui/DetailField";
import { Spinner } from "@/presentation/components/ui/Spinner";
import { formatCurrency, formatDate, LONG_DATE } from "@/presentation/utils/format";

interface MemberDetailModalProps {
  memberId: string;
  onClose: () => void;
}

export function MemberDetailModal({ memberId, onClose }: MemberDetailModalProps) {
  const { getMemberDetail } = useServices();
  const { data, loading } = useAsync(() => getMemberDetail.execute(memberId), [memberId]);

  return (
    <Modal isOpen onClose={onClose} labelledBy="member-detail-title">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 id="member-detail-title" className="text-lg font-semibold text-gray-900">
            Detail Member
          </h3>
          <button onClick={onClose} aria-label="Tutup" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && !data ? (
            <div className="py-12 flex justify-center">
              <Spinner className="w-8 h-8 border-2 border-gray-200 border-t-bni-primary" />
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary text-2xl font-bold">
                  {data.member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{data.member.name}</h4>
                  <p className="text-sm text-gray-500">{data.member.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {data.member.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Chapter">
                  {data.chapterName} <span className="text-gray-400">· {data.cityName}</span>
                </DetailField>
                <DetailField label="Klasifikasi">{data.member.classification}</DetailField>
                <DetailField label="Status">
                  <StatusBadge status={data.member.status} />
                </DetailField>
                <DetailField label="Paket">{data.member.subscription}</DetailField>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Membership</p>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField label="Tanggal Bergabung">{formatDate(data.member.joinDate, LONG_DATE)}</DetailField>
                  <DetailField label="Durasi">{data.member.durationMonths} bulan</DetailField>
                  <DetailField label="Tanggal Renewal">
                    {data.renewalDate ? formatDate(data.renewalDate, LONG_DATE) : "—"}
                  </DetailField>
                  <DetailField label="Biaya Pendaftaran">{formatCurrency(data.member.registrationFee)}</DetailField>
                  <DetailField label="Biaya Membership / thn">{formatCurrency(data.member.membershipFee)}</DetailField>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Referral</p>
                <div className="space-y-3">
                  <DetailField label="Sponsor (diundang oleh)">
                    {data.sponsor ? (
                      data.sponsor.name
                    ) : (
                      <span className="text-gray-400">— Tanpa sponsor —</span>
                    )}
                  </DetailField>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Mengundang ({data.sponsored.length})
                    </p>
                    {data.sponsored.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.sponsored.map((m) => (
                          <span key={m.id} className="text-sm px-2.5 py-1 rounded-full bg-bni-primary/10 text-bni-primary">
                            {m.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Belum mengundang member lain</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}
