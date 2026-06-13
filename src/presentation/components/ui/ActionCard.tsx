import { getIcon, type IconName } from "@/presentation/config/icon-map";

type ActionTone = "blue" | "danger" | "green";

interface ActionCardProps {
  iconName: IconName;
  title: string;
  subtitle: string;
  tone?: ActionTone;
  onClick: () => void;
}

const toneClasses: Record<ActionTone, string> = {
  blue: "bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-500 group-hover:from-blue-500 group-hover:to-blue-500 group-hover:text-white",
  danger:
    "bg-gradient-to-br from-danger/15 to-danger/5 text-danger group-hover:from-danger group-hover:to-danger group-hover:text-white",
  green:
    "bg-gradient-to-br from-success/15 to-success/5 text-success group-hover:from-success group-hover:to-success group-hover:text-white",
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
      className="group bg-white rounded-2xl p-5 shadow-card border border-gray-100/80 text-left transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-bni-primary/30"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200 ${toneClasses[tone]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
    </button>
  );
}
