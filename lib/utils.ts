import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/** Current month as "January-2025". */
export function getCurrentMonthYearString() {
  const now = new Date();
  return getMonthYearString(now.getMonth() + 1, now.getFullYear());
}
