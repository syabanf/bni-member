import { useState } from "react";
import { Plus } from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";

type Tab = "chapters" | "plans" | "regions";

const TABS: { id: Tab; label: string }[] = [
  { id: "chapters", label: "Chapters" },
  { id: "plans", label: "Subscription Plans" },
  { id: "regions", label: "Regions" },
];

export function MasterDataPage() {
  const { getMasterData } = useServices();
  const { data } = useAsync(() => getMasterData.execute(), []);
  const [activeTab, setActiveTab] = useState<Tab>("chapters");

  const chapters = data?.chapters ?? [];
  const plans = data?.plans ?? [];
  const regions = data?.regions ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Data"
        actions={
          <button className="flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        }
      />

      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-bni-primary text-bni-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "chapters" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Code", "Chapter Name", "Region", "Members", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{chapter.code}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{chapter.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{chapter.region}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{chapter.members}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 text-xs bg-success/10 text-success rounded-full">{chapter.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-danger hover:bg-red-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{chapter.name}</p>
                    <p className="text-xs text-gray-500">{chapter.code}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs bg-success/10 text-success rounded-full">{chapter.status}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Region</span>
                    <span className="text-sm text-gray-900">{chapter.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Members</span>
                    <span className="text-sm text-gray-900">{chapter.members}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
                  <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-danger hover:bg-red-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "plans" && (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    IDR {plan.price.toLocaleString("id-ID")} / {plan.duration}
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs bg-success/10 text-success rounded-full">{plan.status}</span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Features:</p>
                <ul className="space-y-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-bni-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "regions" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Code", "Region Name", "Chapters", "Total Members", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regions.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{region.code}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{region.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{region.chapters}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{region.members}</td>
                    <td className="px-5 py-4">
                      <button className="px-3 py-1 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            {regions.map((region) => (
              <div key={region.id} className="p-4">
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900">{region.name}</p>
                  <p className="text-xs text-gray-500">{region.code}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Chapters</span>
                    <span className="text-sm text-gray-900">{region.chapters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 uppercase">Total Members</span>
                    <span className="text-sm text-gray-900">{region.members}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
