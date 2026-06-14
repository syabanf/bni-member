import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import type { City } from "@/domain/entities/City";
import type { CityWithStats } from "@/application/dto/CityWithStats";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { SummaryCards } from "@/presentation/components/ui/SummaryCards";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { CityFormModal } from "@/presentation/components/master-data/CityFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";

const primaryBtn =
  "flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium";
const ghostBtn =
  "flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium";

export function CitiesPage() {
  const { listCities, saveCity, deleteCity } = useServices();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);
  const { data } = useAsync(() => listCities.execute(), [refresh]);
  const rows = data ?? [];
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();
  const filtered = rows.filter(
    ({ city }) =>
      city.name.toLowerCase().includes(q) ||
      city.code.toLowerCase().includes(q) ||
      city.province.toLowerCase().includes(q),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<City | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<City | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteCity.execute(deleteTarget.id);
      setDeleteTarget(null);
      bump();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<CityWithStats>[] = [
    {
      key: "name",
      header: "Kota",
      primary: true,
      sortValue: ({ city }) => city.name,
      cell: ({ city }) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{city.name}</p>
          <p className="text-xs text-gray-500">
            {city.code} · {city.province}
          </p>
        </div>
      ),
    },
    { key: "chapters", header: "Chapter", sortValue: (c) => c.chapterCount, cell: (c) => c.chapterCount },
    { key: "members", header: "Member", sortValue: (c) => c.memberCount, cell: (c) => c.memberCount },
    { key: "status", header: "Status", sortValue: ({ city }) => city.status, cell: ({ city }) => <StatusBadge status={city.status} /> },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: ({ city }) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <IconButton
            label={`Edit ${city.name}`}
            onClick={() => {
              setEditing(city);
              setModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton label={`Hapus ${city.name}`} tone="danger" onClick={() => setDeleteTarget(city)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="BNI Indonesia"
        title="Master Kota"
        description="Kelola daftar kota/area. Tambah, edit, atau hapus kota — setiap kota menaungi beberapa chapter."
        actions={
          <>
            <button onClick={bump} className={ghostBtn}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className={primaryBtn}
            >
              <Plus className="w-4 h-4" />
              Tambah Kota
            </button>
          </>
        }
      />

      <SummaryCards
        items={[
          { iconName: "MapPin", value: rows.length, label: "Total Kota", color: "blue" },
          { iconName: "Building2", value: rows.reduce((s, c) => s + c.chapterCount, 0), label: "Total Chapter", color: "amber" },
          { iconName: "Users", value: rows.reduce((s, c) => s + c.memberCount, 0), label: "Total Member", color: "green" },
        ]}
      />

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari kota / kode / provinsi..."
          ariaLabel="Cari kota"
          className="flex-1"
        />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={({ city }) => city.id}
        emptyText="Belum ada kota"
        onRowClick={({ city }) => navigate(`/master-data/cities/${city.id}`)}
      />

      <CityFormModal
        isOpen={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={async (input) => {
          await saveCity.execute(input);
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Kota"
        message={`Yakin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        error={deleteError}
        deleting={deleting}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
