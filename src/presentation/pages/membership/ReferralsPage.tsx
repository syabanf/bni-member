import { useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw, ArrowRight } from "lucide-react";
import type { Referral } from "@/domain/entities/Referral";
import type { ReferralWithNames } from "@/application/dto/ReferralWithNames";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHero } from "@/presentation/components/ui/PageHero";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { StatusBadge } from "@/presentation/components/ui/StatusBadge";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { FilterBar } from "@/presentation/components/ui/FilterBar";
import { SearchInput } from "@/presentation/components/ui/SearchInput";
import { FilterSelect } from "@/presentation/components/ui/FilterSelect";
import { ReferralFormModal } from "@/presentation/components/membership/ReferralFormModal";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { formatCurrency, formatDate } from "@/presentation/utils/format";

const primaryBtn =
  "flex items-center gap-2 bg-bni-primary hover:bg-bni-dark text-white px-4 py-2 rounded-lg text-sm font-medium";
const ghostBtn =
  "flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium";

export function ReferralsPage() {
  const { listReferrals, saveReferral, deleteReferral, getMembers } = useServices();
  const [refresh, setRefresh] = useState(0);
  const bump = () => setRefresh((r) => r + 1);

  const { data } = useAsync(() => listReferrals.execute(), [refresh]);
  const { data: members } = useAsync(() => getMembers.execute({}), []);
  const rows = data ?? [];
  const memberList = members ?? [];

  const closed = rows.filter((r) => r.referral.status === "Closed");
  const tyfcbTotal = closed.reduce((s, r) => s + r.referral.tyfcb, 0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const ql = search.toLowerCase();
  const filtered = rows.filter(
    (r) =>
      (statusFilter === "All" || r.referral.status === statusFilter) &&
      (r.referral.description.toLowerCase().includes(ql) ||
        r.fromName.toLowerCase().includes(ql) ||
        r.toName.toLowerCase().includes(ql)),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Referral | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Referral | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteReferral.execute(deleteTarget.id);
      setDeleteTarget(null);
      bump();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<ReferralWithNames>[] = [
    {
      key: "ref",
      header: "Referral",
      primary: true,
      cell: ({ referral, fromName, toName }) => (
        <div>
          <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            {fromName}
            <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            {toName}
          </p>
          <p className="text-xs text-gray-500">{referral.description}</p>
        </div>
      ),
    },
    { key: "tier", header: "Tier", cell: ({ referral }) => (referral.tier === "Inside" ? "RGI" : "RGO") },
    { key: "date", header: "Tanggal", cell: ({ referral }) => formatDate(referral.date) },
    { key: "status", header: "Status", cell: ({ referral }) => <StatusBadge status={referral.status} /> },
    {
      key: "tyfcb",
      header: "TYFCB",
      align: "right",
      cell: ({ referral }) =>
        referral.tyfcb > 0 ? (
          <span className="font-medium text-gray-900">{formatCurrency(referral.tyfcb)}</span>
        ) : (
          "—"
        ),
    },
    {
      key: "actions",
      header: "Aksi",
      actions: true,
      cell: ({ referral }) => (
        <div className="flex items-center gap-1">
          <IconButton
            label="Edit referral"
            onClick={() => {
              setEditing(referral);
              setModalOpen(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </IconButton>
          <IconButton label="Hapus referral" tone="danger" onClick={() => setDeleteTarget(referral)}>
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
        title="Referral (Slips)"
        description="Catat referral antar-member dan nilai bisnis (TYFCB) yang dihasilkan — wujud filosofi 'Givers Gain'."
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
              Tambah Referral
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard iconName="Share2" value={rows.length} label="Total Referral" color="blue" />
        <StatCard iconName="RefreshCw" value={closed.length} label="Closed" color="green" />
        <StatCard iconName="CreditCard" value={formatCurrency(tyfcbTotal)} label="Total TYFCB (Closed)" color="red" />
      </div>

      <FilterBar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari deskripsi / member..."
          ariaLabel="Cari referral"
          className="flex-1"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          ariaLabel="Filter status referral"
          options={[
            { value: "All", label: "Semua Status" },
            { value: "Open", label: "Open" },
            { value: "In Progress", label: "In Progress" },
            { value: "Closed", label: "Closed" },
            { value: "Cancelled", label: "Cancelled" },
          ]}
        />
      </FilterBar>

      <DataTable columns={columns} rows={filtered} rowKey={({ referral }) => referral.id} emptyText="Belum ada referral" />

      <ReferralFormModal
        isOpen={modalOpen}
        initial={editing}
        members={memberList}
        onClose={() => setModalOpen(false)}
        onSubmit={async (input) => {
          await saveReferral.execute(input);
          bump();
        }}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Referral"
        message={`Yakin menghapus referral "${deleteTarget?.description}"? Tindakan ini tidak dapat dibatalkan.`}
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
