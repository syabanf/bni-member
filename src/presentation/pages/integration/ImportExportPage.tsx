import { useRef, useState, type ChangeEvent } from "react";
import { Download, Upload, CheckCircle, AlertCircle, Eye, Trash2 } from "lucide-react";
import type { ImportRecord } from "@/domain/entities/ImportRecord";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";
import { DataTable, type Column } from "@/presentation/components/ui/DataTable";
import { IconButton } from "@/presentation/components/ui/IconButton";
import { ConfirmDeleteModal } from "@/presentation/components/ui/ConfirmDeleteModal";
import { useToast } from "@/presentation/providers/ToastProvider";

const TEMPLATE_CSV = [
  "Name,Email,Chapter,Phone,Address",
  "Ahmad Wijaya,ahmad@email.com,Rise,08123456789,Jl. Sudirman No. 123",
  "Siti Nurhaliza,siti@email.com,Grow,08198765432,Jl. Thamrin No. 456",
  "Budi Santoso,budi@email.com,Amplify,08123456780,Jl. Gatot Subroto No. 789",
  "Dewi Lestari,dewi@email.com,Glorify,08199887766,Jl. Rasuna Said No. 101",
  "Hendra Pratama,hendra@email.com,Magnify,08123456999,Jl. MH Thamrin No. 55",
  "Rina Kusuma,rina@email.com,Garuda,08198881234,Jl. Asia Afrika No. 88",
].join("\n");

type UploadStatus = "idle" | "success" | "error";

export function ImportExportPage() {
  const { getImportPreview } = useServices();
  const toast = useToast();
  const { data: preview } = useAsync(() => getImportPreview.execute(), []);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ImportRecord | null>(null);
  const rows = (preview ?? []).filter((r) => !removedIds.includes(r.id));

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRemovedIds((ids) => [...ids, deleteTarget.id]);
    toast(`${deleteTarget.name} dihapus dari daftar import`);
    setDeleteTarget(null);
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bnipayment_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }, 1500);
  };

  const columns: Column<ImportRecord>[] = [
    {
      key: "name",
      header: "Name",
      primary: true,
      sortValue: (d) => d.name,
      cell: (d) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{d.name}</p>
          <p className="text-xs text-gray-500">{d.id}</p>
        </div>
      ),
    },
    { key: "email", header: "Email", sortValue: (d) => d.email, cell: (d) => d.email },
    { key: "chapter", header: "Chapter", sortValue: (d) => d.chapter, cell: (d) => d.chapter },
    {
      key: "status",
      header: "Status",
      sortValue: (d) => d.status,
      cell: (d) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-full ${
            d.status === "Success" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {d.status}
        </span>
      ),
    },
    { key: "renewal", header: "Tanggal Renewal", sortValue: (d) => d.renewalDate, cell: (d) => d.renewalDate },
    {
      key: "actions",
      header: "Actions",
      actions: true,
      cell: (d) => (
        <div className="flex items-center gap-1">
          <IconButton
            label={`View ${d.name}`}
            onClick={() => toast(`${d.name} · ${d.email} · ${d.chapter}`, "info")}
          >
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton label={`Delete ${d.name}`} tone="danger" onClick={() => setDeleteTarget(d)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Export / Import" />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Data Member</h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload file Excel/CSV untuk mengimport data member. Pastikan format sesuai template.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Format Template
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center justify-center gap-2 bg-bni-primary hover:bg-bni-dark disabled:opacity-50 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload File Excel
              </>
            )}
          </button>
        </div>

        {uploadStatus === "success" && (
          <div className="mt-4 flex items-center gap-2 text-success bg-success/10 px-4 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">File berhasil diupload! Data sedang diproses.</span>
          </div>
        )}
        {uploadStatus === "error" && (
          <div className="mt-4 flex items-center gap-2 text-danger bg-danger/10 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Upload gagal. Silakan coba lagi.</span>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(d) => d.id}
        emptyText="Belum ada data import"
        header={
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Review Data Import</h3>
            <p className="text-sm text-gray-500 mt-1">
              Data yang baru saja diimport atau dalam proses.
            </p>
          </div>
        }
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Hapus Data Import"
        message={`Hapus "${deleteTarget?.name}" dari daftar import?`}
        deleting={false}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
