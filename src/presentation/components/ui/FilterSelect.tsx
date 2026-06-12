import { Select, type SelectOption } from "./Select";

export type FilterOption = SelectOption;

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  ariaLabel: string;
  className?: string;
}

/** Standardised scrollable dropdown used in filter bars. */
export function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      ariaLabel={ariaLabel}
      className={className ?? "w-full md:w-44"}
    />
  );
}
