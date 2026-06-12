import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getIcon, type IconName } from "@/presentation/config/icon-map";

type StatColor = "red" | "amber" | "blue" | "green";
type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  iconName: IconName;
  value: number | string;
  label: string;
  trend?: string;
  trendDirection?: TrendDirection;
  color?: StatColor;
}

const colorClasses: Record<StatColor, string> = {
  red: "bg-bni-primary/10 text-bni-primary",
  amber: "bg-warning/10 text-warning",
  blue: "bg-blue-500/10 text-blue-500",
  green: "bg-success/10 text-success",
};

const trendColorClasses: Record<TrendDirection, string> = {
  up: "text-danger",
  down: "text-success",
  neutral: "text-gray-500",
};

export function StatCard({
  iconName,
  value,
  label,
  trend,
  trendDirection = "neutral",
  color = "red",
}: StatCardProps) {
  const Icon = getIcon(iconName);
  const TrendIcon =
    trendDirection === "up"
      ? TrendingUp
      : trendDirection === "down"
        ? TrendingDown
        : Minus;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trendColorClasses[trendDirection]}`}>
            <TrendIcon className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}
