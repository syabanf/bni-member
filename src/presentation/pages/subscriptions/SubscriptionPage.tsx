import { useState } from "react";
import { Plus, Download, Search, FileText } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/presentation/utils/format";

export function SubscriptionPage() {
  const { getSubscriptions } = useServices();
  const [search, setSearch] = useState("");
  const { data } = useAsync(() => getSubscriptions.execute(search), [search]);
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Data"
        actions={
          <button className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            New Subscription
          </button>
        }
      />

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscription..."
              aria-label="Search subscription"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bni-primary/20"
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Member", "Plan", "Amount", "Start Date", "End Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sub.memberName}</p>
                        <p className="text-xs text-gray-500">{sub.memberId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{sub.plan}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatCurrency(sub.amount)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(sub.startDate)}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(sub.endDate)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={sub.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">View</button>
                      <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {rows.map((sub) => (
            <div key={sub.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-bni-primary/10 flex items-center justify-center text-bni-primary flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{sub.memberName}</p>
                  <p className="text-xs text-gray-500">{sub.memberId}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Plan</span>
                  <span className="text-sm font-medium text-gray-900">{sub.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Amount</span>
                  <span className="text-sm text-gray-900">{formatCurrency(sub.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Start Date</span>
                  <span className="text-sm text-gray-900">{formatDate(sub.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">End Date</span>
                  <span className="text-sm text-gray-900">{formatDate(sub.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Status</span>
                  <StatusBadge status={sub.status} />
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">View</button>
                <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="p-8 text-center text-gray-500">No subscriptions found</div>
          )}
        </div>
      </div>
    </div>
  );
}
