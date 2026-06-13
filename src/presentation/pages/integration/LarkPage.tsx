import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  Clock,
  Link2,
} from "lucide-react";
import { useToast } from "@/presentation/providers/ToastProvider";

const SYNC_TABS = [
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "documents", label: "Documents", icon: FileText },
] as const;

function ToggleSwitch({ defaultChecked }: { defaultChecked?: boolean }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bni-primary" />
    </label>
  );
}

export function LarkPage() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastSync, setLastSync] = useState<string>("Never");
  const [activeTab, setActiveTab] = useState<string>("messaging");
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

  const syncStats = [
    { label: "Messages Synced", value: isConnected ? "3,521" : "-", icon: MessageSquare },
    { label: "Calendar Events", value: isConnected ? "156" : "-", icon: Calendar },
    { label: "Documents", value: isConnected ? "89" : "-", icon: FileText },
    { label: "Active Groups", value: isConnected ? "12" : "-", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Lark (Feishu) Integration</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                isConnected ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
              }`}
            >
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lark Integration</h3>
              <p className="text-sm text-gray-500">Messaging, Calendar & Document Sync</p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {syncStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs uppercase">{stat.label}</span>
                </div>
                <p className="text-lg font-medium text-gray-900">{stat.value}</p>
              </div>
            );
          })}
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
              <span className="text-xs uppercase">App ID</span>
            </div>
            <p className="text-sm font-medium text-gray-900 font-mono">cli_1234567890</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase">Workspace</span>
            </div>
            <p className="text-sm font-medium text-gray-900">WIT.ID Workspace</p>
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
                Connect to Lark
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {SYNC_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-bni-primary text-bni-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "messaging" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Group Message Sync</p>
                  <p className="text-sm text-gray-500">Sync member notifications to Lark groups</p>
                </div>
                <ToggleSwitch defaultChecked={!!isConnected} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Payment Notifications</p>
                  <p className="text-sm text-gray-500">Send payment reminders to Lark</p>
                </div>
                <ToggleSwitch defaultChecked={!!isConnected} />
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Event Sync</p>
                  <p className="text-sm text-gray-500">Sync BNI events to Lark Calendar</p>
                </div>
                <ToggleSwitch defaultChecked={!!isConnected} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Meeting Reminders</p>
                  <p className="text-sm text-gray-500">Auto-create Lark meetings for renewals</p>
                </div>
                <ToggleSwitch />
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Invoice PDF Sync</p>
                  <p className="text-sm text-gray-500">Auto-save invoices to Lark Drive</p>
                </div>
                <ToggleSwitch defaultChecked={!!isConnected} />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Report Sharing</p>
                  <p className="text-sm text-gray-500">Share monthly reports to Lark Docs</p>
                </div>
                <ToggleSwitch />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lark API Configuration</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">App ID</span>
              <button
                onClick={() => toast("Konfigurasi kredensial belum tersedia", "info")}
                className="text-xs text-bni-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <code className="text-sm text-gray-600">cli_1234567890abcdef</code>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">App Secret</span>
              <button
                onClick={() => toast("Konfigurasi kredensial belum tersedia", "info")}
                className="text-xs text-bni-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <code className="text-sm text-gray-600">••••••••••••••••••••••••</code>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Webhook URL</span>
              <button
                onClick={() => {
                  void navigator.clipboard?.writeText("https://bnipayment.com/api/webhooks/lark");
                  toast("Webhook URL disalin");
                }}
                className="text-xs text-bni-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <code className="text-sm text-gray-600">https://bnipayment.com/api/webhooks/lark</code>
          </div>
        </div>
      </div>
    </div>
  );
}
