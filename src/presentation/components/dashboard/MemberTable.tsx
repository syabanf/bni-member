import { useState } from "react";
import { Eye, Pencil, Trash2, Search, X } from "lucide-react";
import type { PaymentRecord } from "@/domain/entities/Payment";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { ViewMemberModal } from "./ViewMemberModal";
import { formatDate, SHORT_DATE } from "@/presentation/utils/format";

interface MemberTableProps {
  data: PaymentRecord[];
  title?: string;
}

export function MemberTable({ data, title = "Recent Member Activity" }: MemberTableProps) {
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<PaymentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = data.filter(
    (record) =>
      record.memberName.toLowerCase().includes(search.toLowerCase()) ||
      record.chapter.toLowerCase().includes(search.toLowerCase()) ||
      record.status.toLowerCase().includes(search.toLowerCase()),
  );

  const handleView = (record: PaymentRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search records"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Bersihkan pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Chapter", "Status", "Payment", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary text-sm font-medium">
                          {record.memberName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{record.memberName}</p>
                          <p className="text-xs text-gray-500">{record.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{record.chapter}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={record.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(record.date, SHORT_DATE)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(record)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                          aria-label={`View ${record.memberName}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                          aria-label={`Edit ${record.memberName}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-danger"
                          aria-label={`Delete ${record.memberName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No data found</div>
          ) : (
            filteredData.map((record) => (
              <div key={record.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary text-sm font-medium flex-shrink-0">
                    {record.memberName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.memberName}</p>
                    <p className="text-xs text-gray-500">{record.memberId}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Chapter</span>
                    <span className="text-sm text-gray-900">{record.chapter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Status</span>
                    <StatusBadge status={record.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Payment</span>
                    <StatusBadge status={record.paymentStatus} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Date</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(record.date, SHORT_DATE)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleView(record)}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    View
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-danger hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Showing {filteredData.length} of {data.length} records
          </span>
        </div>
      </div>

      <ViewMemberModal data={selectedRecord} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
