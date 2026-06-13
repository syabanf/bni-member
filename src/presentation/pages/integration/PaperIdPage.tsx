import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Clock,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { useToast } from "@/presentation/providers/ToastProvider";

export function PaperIdPage() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastSync, setLastSync] = useState<string>("Never");
  const toast = useToast();

  const checkConnection = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsConnected(true);
      setLastSync(new Date().toLocaleString("id-ID"));
      setIsChecking(false);
    }, 1500);
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setLastSync("Disconnected");
    } else {
      setIsChecking(true);
      setTimeout(() => {
        setIsConnected(true);
        setLastSync(new Date().toLocaleString("id-ID"));
        setIsChecking(false);
      }, 1500);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Paper.id Connection</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                isConnected ? "bg-success/10 text-success" : "bg-gray-100 text-gray-400"
              }`}
            >
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Paper.id Integration</h3>
              <p className="text-sm text-gray-500">Invoice & Payment Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isConnected === null ? (
              <span className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                Checking...
              </span>
            ) : isConnected ? (
              <span className="flex items-center gap-2 px-4 py-2 text-sm bg-success/10 text-success rounded-full">
                <CheckCircle className="w-4 h-4" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 text-sm bg-danger/10 text-danger rounded-full">
                <XCircle className="w-4 h-4" />
                Disconnected
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase">Last Sync</span>
            </div>
            <p className="text-sm font-medium text-gray-900">{lastSync}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Link2 className="w-4 h-4" />
              <span className="text-xs uppercase">Endpoint</span>
            </div>
            <p className="text-sm font-medium text-gray-900">api.paper.id/v1</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs uppercase">Invoices Synced</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {isConnected ? "1,247 invoices" : "-"}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Check Connection
              </>
            )}
          </button>
          <button
            onClick={handleToggleConnection}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              isConnected
                ? "border border-danger text-danger hover:bg-red-50"
                : "bg-bni-primary text-white hover:bg-bni-dark"
            }`}
          >
            {isConnected ? (
              <>
                <XCircle className="w-4 h-4" />
                Disconnect
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Connect to Paper.id
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-medium text-gray-900">Invoice Data</p>
                <p className="text-xs text-gray-500">Last synced: {isConnected ? "2 minutes ago" : "-"}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{isConnected ? "Real-time sync" : "Not synced"}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-medium text-gray-900">Payment Status</p>
                <p className="text-xs text-gray-500">Last synced: {isConnected ? "5 minutes ago" : "-"}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{isConnected ? "Real-time sync" : "Not synced"}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${isConnected ? "text-warning" : "text-gray-400"}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">Failed Syncs</p>
                <p className="text-xs text-gray-500">Last 24 hours</p>
              </div>
            </div>
            <span className={`text-sm font-medium ${isConnected ? "text-warning" : "text-gray-400"}`}>
              {isConnected ? "3 failed" : "-"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">API Key</span>
              <button
                onClick={() => toast("Konfigurasi API Key belum tersedia", "info")}
                className="text-xs text-bni-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <code className="text-sm text-gray-600">••••••••••••••••••••••••••••••</code>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Webhook URL</span>
              <button
                onClick={() => {
                  void navigator.clipboard?.writeText("https://bnipayment.com/api/webhooks/paperid");
                  toast("Webhook URL disalin");
                }}
                className="text-xs text-bni-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <code className="text-sm text-gray-600">https://bnipayment.com/api/webhooks/paperid</code>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Sync Frequency</span>
              <span className="text-xs text-gray-500">Real-time</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-bni-primary h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
