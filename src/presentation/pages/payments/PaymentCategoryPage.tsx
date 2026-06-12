import { useState } from "react";
import type { PaymentCategory, PaymentSummary } from "@/domain/entities/Payment";
import type { IconName } from "@/presentation/config/icon-map";
import { useServices } from "@/presentation/providers/ServicesProvider";
import { useAsync } from "@/presentation/hooks/useAsync";
import { StatCard } from "@/presentation/components/ui/StatCard";
import { ActionCard } from "@/presentation/components/ui/ActionCard";
import { MemberTable } from "@/presentation/components/dashboard/MemberTable";
import { SendConfirmModal } from "@/presentation/components/ui/SendConfirmModal";
import { SuccessModal } from "@/presentation/components/ui/SuccessModal";

interface CategoryConfig {
  stat: {
    iconName: IconName;
    summaryKey: keyof PaymentSummary;
    label: string;
    trend: string;
    trendDirection: "up" | "down" | "neutral";
    color: "red" | "amber" | "blue" | "green";
  };
  action: { subtitle: string; tone: "blue" | "danger" };
  modal: {
    confirmTitle: string;
    noun: string;
    tone: "primary" | "danger";
    successNoun: string;
  };
  tableTitle: string;
}

const CONFIG: Record<PaymentCategory, CategoryConfig> = {
  outstanding: {
    stat: { iconName: "CreditCard", summaryKey: "outstanding", label: "Outstanding Payment", trend: "+12%", trendDirection: "up", color: "red" },
    action: { subtitle: "Sent All Invoice", tone: "blue" },
    modal: { confirmTitle: "Konfirmasi Kirim Invoice", noun: "invoice", tone: "primary", successNoun: "invoice" },
    tableTitle: "Outstanding Payment",
  },
  awaiting: {
    stat: { iconName: "Clock", summaryKey: "awaiting", label: "Awaiting Confirmation", trend: "-5%", trendDirection: "down", color: "amber" },
    action: { subtitle: "Sent All Reminder", tone: "blue" },
    modal: { confirmTitle: "Konfirmasi Kirim Reminder", noun: "reminder", tone: "primary", successNoun: "reminder" },
    tableTitle: "Awaiting Payment",
  },
  renewal: {
    stat: { iconName: "RefreshCw", summaryKey: "renewal", label: "Renewal This Month", trend: "0%", trendDirection: "neutral", color: "blue" },
    action: { subtitle: "Sent All Invoice", tone: "blue" },
    modal: { confirmTitle: "Konfirmasi Kirim Invoice Renewal", noun: "invoice renewal", tone: "primary", successNoun: "invoice renewal" },
    tableTitle: "Renewal This Month",
  },
  overdue: {
    stat: { iconName: "AlertTriangle", summaryKey: "overdue", label: "Overdue Payment", trend: "+3", trendDirection: "up", color: "red" },
    action: { subtitle: "Sent Cancellation", tone: "danger" },
    modal: { confirmTitle: "Konfirmasi Kirim Penalti", noun: "penalti", tone: "danger", successNoun: "penalti" },
    tableTitle: "Overdue Payment",
  },
};

interface PaymentCategoryPageProps {
  category: PaymentCategory;
}

export function PaymentCategoryPage({ category }: PaymentCategoryPageProps) {
  const cfg = CONFIG[category];
  const { getPaymentsByCategory, getPaymentSummary, sendBulkNotifications } =
    useServices();

  const { data: records } = useAsync(
    () => getPaymentsByCategory.execute(category),
    [category],
  );
  const { data: summary } = useAsync(() => getPaymentSummary.execute(), []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const items = records ?? [];
  const recipients = items.map((r) => ({
    id: r.id,
    name: r.memberName,
    email: r.email,
  }));

  const handleConfirm = async () => {
    setSending(true);
    await sendBulkNotifications.execute(recipients);
    setSending(false);
    setShowConfirm(false);
    setShowSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          iconName={cfg.stat.iconName}
          value={summary?.[cfg.stat.summaryKey] ?? "—"}
          label={cfg.stat.label}
          trend={cfg.stat.trend}
          trendDirection={cfg.stat.trendDirection}
          color={cfg.stat.color}
        />
        <ActionCard
          iconName="Send"
          title="Kirim"
          subtitle={cfg.action.subtitle}
          tone={cfg.action.tone}
          onClick={() => setShowConfirm(true)}
        />
      </div>

      <MemberTable data={items} title={cfg.tableTitle} />

      <SendConfirmModal
        isOpen={showConfirm}
        title={cfg.modal.confirmTitle}
        noun={cfg.modal.noun}
        tone={cfg.modal.tone}
        recipients={recipients}
        sending={sending}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
      <SuccessModal
        isOpen={showSuccess}
        message={`${items.length} ${cfg.modal.successNoun} berhasil dikirim`}
        subMessage="Email telah dikirim ke semua member"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
