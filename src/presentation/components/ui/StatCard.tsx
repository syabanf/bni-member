import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";
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
  /** When set, the card becomes a clickable drill-down link to this route. */
  to?: string;
}

const chipClasses: Record<StatColor, string> = {
  red: "bg-gradient-to-br from-bni-primary/15 to-bni-primary/5 text-bni-primary",
  amber: "bg-gradient-to-br from-warning/15 to-warning/5 text-warning",
  blue: "bg-gradient-to-br from-blue-500/15 to-blue-500/5 text-blue-500",
  green: "bg-gradient-to-br from-success/15 to-success/5 text-success",
};

const trendPill: Record<TrendDirection, string> = {
  up: "text-danger bg-danger/10",
  down: "text-success bg-success/10",
  neutral: "text-gray-500 bg-gray-100",
};

export function StatCard({
  iconName,
  value,
  label,
  trend,
  trendDirection = "neutral",
  color = "red",
  to,
}: StatCardProps) {
  const Icon = getIcon(iconName);
  const TrendIcon =
    trendDirection === "up" ? TrendingUp : trendDirection === "down" ? TrendingDown : Minus;

  const body = (
    <>
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${chipClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendPill[trendDirection]}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          {label}
          {to && (
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 transition-all group-hover:text-bni-primary group-hover:translate-x-0.5" />
          )}
        </p>
      </div>
    </>
  );

  const base = "bg-white rounded-2xl p-5 shadow-card border border-gray-100/80";

  if (to) {
    return (
      <Link
        to={to}
        className={`group block ${base} transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-bni-primary/30`}
      >
        {body}
      </Link>
    );
  }

  return <div className={base}>{body}</div>;
}
