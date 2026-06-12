import { X } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { Modal } from "@/presentation/components/ui/Modal";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DetailField } from "@/presentation/components/ui/DetailField";
import { Spinner } from "@/presentation/components/ui/Spinner";
import { formatDate, LONG_DATE } from "@/presentation/utils/format";

interface ChapterDetailModalProps {
  chapterId: string;
  onClose: () => void;
}

export function ChapterDetailModal({ chapterId, onClose }: ChapterDetailModalProps) {
  const { getChapterDetail } = useServices();
  const { data, loading } = useAsync(() => getChapterDetail.execute(chapterId), [chapterId]);

  return (
    <Modal isOpen onClose={onClose} labelledBy="chapter-detail-title">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-modal-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 id="chapter-detail-title" className="text-lg font-semibold text-gray-900">
            Detail Chapter
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
                  <h4 className="text-xl font-semibold text-gray-900">{data.chapter.name}</h4>
                  <p className="text-sm text-gray-500">
                    {data.chapter.code} · {data.cityName}
                  </p>
                </div>
                <StatusBadge status={data.chapter.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailField label="Hari Meeting">{data.chapter.meetingDay}</DetailField>
                <DetailField label="Jam Meeting">{data.chapter.meetingTime}</DetailField>
                <DetailField label="Venue">{data.chapter.venue || "—"}</DetailField>
                <DetailField label="Tanggal Launch">{formatDate(data.chapter.launchDate, LONG_DATE)}</DetailField>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Member ({data.members.length})
                </p>
                {data.members.length > 0 ? (
                  <div className="space-y-2">
                    {data.members.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-500">
                            {m.classification} · {m.role}
                          </p>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Belum ada member di chapter ini</p>
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
