import { StatCard } from "./StatCard";
import type { IconName } from "@/presentation/config/icon-map";

export interface SummaryItem {
  iconName: IconName;
  value: number | string;
  label: string;
  color?: "red" | "amber" | "blue" | "green";
}

const colsByLen: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 xl:grid-cols-4",
};

/** Standardised row of summary stat cards shown at the top of list pages. */
export function SummaryCards({ items }: { items: SummaryItem[] }) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${colsByLen[items.length] ?? "sm:grid-cols-4"}`}>
      {items.map((it) => (
        <StatCard
          key={it.label}
          iconName={it.iconName}
          value={it.value}
          label={it.label}
          color={it.color}
        />
      ))}
    </div>
  );
}
