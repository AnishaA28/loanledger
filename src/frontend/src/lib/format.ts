// Indian number formatting utilities for LoanLedger

/**
 * Formats a number as Indian Rupee currency string.
 * Uses Indian number system: ₹XX,XX,XXX
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number using Indian number grouping (no currency symbol).
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN").format(amount);
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) to a readable format.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Returns today's date as YYYY-MM-DD for date input default values.
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Converts a BigInt backend amount to a display number.
 */
export function bigIntToNumber(value: bigint): number {
  return Number(value);
}
