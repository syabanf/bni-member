import { getIcon, type IconName } from "@/presentation/config/icon-map";

type ActionTone = "blue" | "danger";

interface ActionCardProps {
  iconName: IconName;
  title: string;
  subtitle: string;
  tone?: ActionTone;
  onClick: () => void;
}

const toneClasses: Record<ActionTone, string> = {
  blue: "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
  danger: "bg-danger/10 text-danger group-hover:bg-danger group-hover:text-white",
};

/** A clickable stat-card-styled button (e.g. "Kirim — Sent All Invoice"). */
export function ActionCard({
  iconName,
  title,
  subtitle,
  tone = "blue",
  onClick,
}: ActionCardProps) {
  const Icon = getIcon(iconName);
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-bni-primary hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg transition-colors ${toneClasses[tone]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </button>
  );
}
