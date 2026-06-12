/** Format a number as Indonesian Rupiah (no decimals). */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string using the id-ID locale. */
export function formatDate(
  date: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Date(date).toLocaleDateString("id-ID", options);
}

/** Short date, e.g. "1 Jun 2024". */
export const SHORT_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

/** Long date, e.g. "1 Juni 2024". */
export const LONG_DATE: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};
