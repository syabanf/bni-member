import { X } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { Modal } from "@/presentation/components/ui/Modal";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { Spinner } from "@/presentation/components/ui/Spinner";

interface CityDetailModalProps {
  cityId: string;
  onClose: () => void;
}

export function CityDetailModal({ cityId, onClose }: CityDetailModalProps) {
  const { getCityDetail } = useServices();
  const { data, loading } = useAsync(() => getCityDetail.execute(cityId), [cityId]);

  return (
    <Modal isOpen onClose={onClose} labelledBy="city-detail-title">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 id="city-detail-title" className="text-lg font-semibold text-gray-900">
            Detail Kota
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
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{data.city.name}</h4>
                  <p className="text-sm text-gray-500">
                    {data.city.code} · {data.city.province}
                  </p>
                </div>
                <StatusBadge status={data.city.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{data.chapters.length}</p>
                  <p className="text-sm text-gray-500">Chapter</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{data.memberCount}</p>
                  <p className="text-sm text-gray-500">Member</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Chapter ({data.chapters.length})
                </p>
                {data.chapters.length > 0 ? (
                  <div className="space-y-2">
                    {data.chapters.map(({ chapter, memberCount }) => (
                      <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{chapter.name}</p>
                          <p className="text-xs text-gray-500">
                            {chapter.code} · {memberCount} member
                          </p>
                        </div>
                        <StatusBadge status={chapter.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Belum ada chapter di kota ini</p>
                )}
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
