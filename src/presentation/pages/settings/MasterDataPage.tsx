import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import type { City } from "@/domain/entities/City";
import type { Chapter } from "@/domain/entities/Chapter";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { CityFormModal } from "@/presentation/components/master-data/CityFormModal";
import { ChapterFormModal } from "@/presentation/components/master-data/ChapterFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { CityDetailModal } from "@/presentation/components/master-data/CityDetailModal";
import { ChapterDetailModal } from "@/presentation/components/master-data/ChapterDetailModal";

type Tab = "cities" | "chapters" | "plans";

const TABS: { id: Tab; label: string }[] = [
  { id: "cities", label: "Kota" },
  { id: "chapters", label: "Chapter" },
  { id: "plans", label: "Membership Plan" },
];

interface DeleteTarget {
  type: "city" | "chapter";
  id: string;
  name: string;
}

const primaryBtn =
  "flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium";
const thClass = "px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap";

export function MasterDataPage() {
  const {
    listCities,
    saveCity,
    deleteCity,
    listChapters,
    saveChapter,
    deleteChapter,
    getMasterData,
  } = useServices();

  const [activeTab, setActiveTab] = useState<Tab>("cities");
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);

  const { data: cities } = useAsync(() => listCities.execute(), [refresh]);
  const { data: chapters } = useAsync(() => listChapters.execute(), [refresh]);
  const { data: master } = useAsync(() => getMasterData.execute(), []);

  const cityList = cities ?? [];
  const chapterList = chapters ?? [];
  const plans = master?.plans ?? [];
  const cityEntities: City[] = cityList.map((c) => c.city);

  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [detailCityId, setDetailCityId] = useState<string | null>(null);
  const [detailChapterId, setDetailChapterId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      if (deleteTarget.type === "city") await deleteCity.execute(deleteTarget.id);
      else await deleteChapter.execute(deleteTarget.id);
      setDeleteTarget(null);
      bump();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const headerAction =
    activeTab === "cities" ? (
      <button
        onClick={() => {
          setEditingCity(null);
          setCityModalOpen(true);
        }}
        className={primaryBtn}
      >
        <Plus className="w-4 h-4" />
        Tambah Kota
      </button>
    ) : activeTab === "chapters" ? (
      <button
        onClick={() => {
          setEditingChapter(null);
          setChapterModalOpen(true);
        }}
        className={primaryBtn}
      >
        <Plus className="w-4 h-4" />
        Tambah Chapter
      </button>
    ) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="Master Data" actions={headerAction} />

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

      {/* Cities */}
      {activeTab === "cities" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Kode", "Kota", "Provinsi", "Chapter", "Member", "Status", "Aksi"].map((h) => (
                  <th key={h} className={thClass}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cityList.map(({ city, chapterCount, memberCount }) => (
                <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{city.code}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{city.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{city.province}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{chapterCount}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{memberCount}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={city.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDetailCityId(city.id)}
                        aria-label={`Detail ${city.name}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCity(city);
                          setCityModalOpen(true);
                        }}
                        aria-label={`Edit ${city.name}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({ type: "city", id: city.id, name: city.name })
                        }
                        aria-label={`Hapus ${city.name}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cityList.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Belum ada kota
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Chapters */}
      {activeTab === "chapters" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Kode", "Chapter", "Kota", "Meeting", "Member", "Status", "Aksi"].map((h) => (
                  <th key={h} className={thClass}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chapterList.map(({ chapter, cityName, memberCount }) => (
                <tr key={chapter.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{chapter.code}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{chapter.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{cityName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {chapter.meetingDay}, {chapter.meetingTime}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{memberCount}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={chapter.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setDetailChapterId(chapter.id)}
                        aria-label={`Detail ${chapter.name}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingChapter(chapter);
                          setChapterModalOpen(true);
                        }}
                        aria-label={`Edit ${chapter.name}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteTarget({ type: "chapter", id: chapter.id, name: chapter.name })
                        }
                        aria-label={`Hapus ${chapter.name}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {chapterList.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Belum ada chapter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Plans (read-only) */}
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
                <span className="px-2.5 py-1 text-xs bg-success/10 text-success rounded-full">
                  {plan.status}
                </span>
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
            </div>
          ))}
        </div>
      )}

      <CityFormModal
        isOpen={cityModalOpen}
        initial={editingCity}
        onClose={() => setCityModalOpen(false)}
        onSubmit={async (input) => {
          await saveCity.execute(input);
          bump();
        }}
      />
      <ChapterFormModal
        isOpen={chapterModalOpen}
        initial={editingChapter}
        cities={cityEntities}
        onClose={() => setChapterModalOpen(false)}
        onSubmit={async (input) => {
          await saveChapter.execute(input);
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={`Hapus ${deleteTarget?.type === "city" ? "Kota" : "Chapter"}`}
        message={`Yakin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        error={deleteError}
        deleting={deleting}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />

      {detailCityId && (
        <CityDetailModal cityId={detailCityId} onClose={() => setDetailCityId(null)} />
      )}
      {detailChapterId && (
        <ChapterDetailModal
          chapterId={detailChapterId}
          onClose={() => setDetailChapterId(null)}
        />
      )}
    </div>
  );
}
