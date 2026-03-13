import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD. Defaults to whole dollars (0 decimals); pass fractionDigits for cents. */
export function formatCurrency(
  value: number,
  options?: { fractionDigits?: number }
): string {
  const fractionDigits = options?.fractionDigits ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Convert hex color (e.g. "#0ea5e9") to rgba string with given alpha (0–1). */
export function hexToRgba(hex: string, alpha: number): string {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/** Blend two hex colors (e.g. "#0ea5e9", "#6366f1") at a given ratio (0–1, default 0.5). */
export function blendHex(hex1: string, hex2: string, ratio = 0.5): string {
  const r = Math.round(parseInt(hex1.slice(1, 3), 16) * (1 - ratio) + parseInt(hex2.slice(1, 3), 16) * ratio);
  const g = Math.round(parseInt(hex1.slice(3, 5), 16) * (1 - ratio) + parseInt(hex2.slice(3, 5), 16) * ratio);
  const b = Math.round(parseInt(hex1.slice(5, 7), 16) * (1 - ratio) + parseInt(hex2.slice(5, 7), 16) * ratio);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse optional date string (e.g. "January-2025") to month/year numbers. Defaults to current month. */
export function getMonthAndYearNumberFromDate(date: string | undefined) {
  const now = new Date();
  if (!date) {
    return {
      monthNumber: now.getMonth() + 1,
      yearNumber: now.getFullYear(),
    };
  }
  const [monthName, yearStr] = date.split("-");
  const monthIndex = MONTH_NAMES.findIndex((month) => month.toLowerCase() === monthName?.toLowerCase());
  const yearNumber = yearStr ? parseInt(yearStr, 10) : now.getFullYear();
  const monthNumber = monthIndex >= 0 ? monthIndex + 1 : now.getMonth() + 1;
  return { monthNumber, yearNumber };
}

/** Format "January-2025" → "January 2025" for display. */
export function formatMonthYearForDisplay(monthStr: string | undefined) {
  if (!monthStr) {
    const now = new Date();
    return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  }
  return monthStr.replace("-", " ");
}

/** Build month param string from month/year numbers. */
export function getMonthYearString(month: number, year: number) {
  const name = MONTH_NAMES[month - 1];
  return name ? `${name}-${year}` : `${year}`;
}

/** Compute the next recurring date by adding the appropriate interval. Returns null for 'never'. */
export function computeNextRecurringDate(date: string, frequency: string): string | null {
  if (frequency === 'never') return null;
  const d = new Date(date + 'T12:00:00');
  switch (frequency) {
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'biweekly':
      d.setDate(d.getDate() + 14);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      return null;
  }
  return d.toISOString().split('T')[0];
}

/** Current month as "January-2025". */
export function getCurrentMonthYearString() {
  const now = new Date();
  return getMonthYearString(now.getMonth() + 1, now.getFullYear());
}
