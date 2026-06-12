import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import type { City } from "@/domain/entities/City";
import type { Chapter } from "@/domain/entities/Chapter";
import type { CityWithStats } from "@/application/dto/CityWithStats";
import type { ChapterWithStats } from "@/application/dto/ChapterWithStats";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
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

  const cityColumns: Column<CityWithStats>[] = [
    {
      key: "name",
      header: "Kota",
      primary: true,
      cell: ({ city }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{city.name}</p>
          <p className="text-xs text-gray-500">
            {city.code} · {city.province}
          </p>
        </div>
      ),
    },
    { key: "chapters", header: "Chapter", cell: (c) => c.chapterCount },
    { key: "members", header: "Member", cell: (c) => c.memberCount },
    { key: "status", header: "Status", cell: ({ city }) => <StatusBadge status={city.status} /> },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: ({ city }) => (
        <div className="flex items-center gap-1">
          <IconButton label={`Detail ${city.name}`} onClick={() => setDetailCityId(city.id)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Edit ${city.name}`}
            onClick={() => {
              setEditingCity(city);
              setCityModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Hapus ${city.name}`}
            tone="danger"
            onClick={() => setDeleteTarget({ type: "city", id: city.id, name: city.name })}
          >
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  const chapterColumns: Column<ChapterWithStats>[] = [
    {
      key: "name",
      header: "Chapter",
      primary: true,
      cell: ({ chapter, cityName }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{chapter.name}</p>
          <p className="text-xs text-gray-500">
            {chapter.code} · {cityName}
          </p>
        </div>
      ),
    },
    {
      key: "meeting",
      header: "Meeting",
      cell: ({ chapter }) => `${chapter.meetingDay}, ${chapter.meetingTime}`,
    },
    { key: "members", header: "Member", cell: (c) => c.memberCount },
    { key: "status", header: "Status", cell: ({ chapter }) => <StatusBadge status={chapter.status} /> },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: ({ chapter }) => (
        <div className="flex items-center gap-1">
          <IconButton label={`Detail ${chapter.name}`} onClick={() => setDetailChapterId(chapter.id)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Edit ${chapter.name}`}
            onClick={() => {
              setEditingChapter(chapter);
              setChapterModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton
            label={`Hapus ${chapter.name}`}
            tone="danger"
            onClick={() => setDeleteTarget({ type: "chapter", id: chapter.id, name: chapter.name })}
          >
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

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

      {activeTab === "cities" && (
        <DataTable
          columns={cityColumns}
          rows={cityList}
          rowKey={({ city }) => city.id}
          emptyText="Belum ada kota"
        />
      )}

      {activeTab === "chapters" && (
        <DataTable
          columns={chapterColumns}
          rows={chapterList}
          rowKey={({ chapter }) => chapter.id}
          emptyText="Belum ada chapter"
        />
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
