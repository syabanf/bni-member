import { useRef, useState, type ChangeEvent } from "react";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { PageHeader } from "@/presentation/components/ui/PageHeader";

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
  const { data: preview } = useAsync(() => getImportPreview.execute(), []);
  const rows = preview ?? [];

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
    // Simulate upload + processing.
    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }, 1500);
  };

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Review Data Import</h3>
          <p className="text-sm text-gray-500 mt-1">Data yang baru saja diimport atau dalam proses.</p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["ID Import", "Name", "Email", "Chapter", "Status", "Tanggal Renewal", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{data.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{data.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{data.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{data.chapter}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full ${
                        data.status === "Success"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{data.renewalDate}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button aria-label={`View ${data.name}`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button aria-label={`Delete ${data.name}`} className="p-2 text-danger hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {rows.map((data) => (
            <div key={data.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{data.name}</p>
                  <p className="text-xs text-gray-500">{data.id}</p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs rounded-full ${
                    data.status === "Success"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {data.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Email</span>
                  <span className="text-sm text-gray-900">{data.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Chapter</span>
                  <span className="text-sm text-gray-900">{data.chapter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 uppercase">Tanggal Renewal</span>
                  <span className="text-sm text-gray-900">{data.renewalDate}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button className="flex-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs">View</span>
                </button>
                <button className="flex-1 p-2 text-danger hover:bg-red-50 rounded-lg flex items-center justify-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada data import</p>
            <p className="text-sm">Upload file Excel untuk melihat data disini</p>
          </div>
        )}
      </div>
    </div>
  );
}
