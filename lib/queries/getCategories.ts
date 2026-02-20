import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";
import type { CategoryWithLineItems } from "@/types";

export async function getCategories({
  date,
  householdId,
}: {
  date: string | undefined;
  householdId: string | null;
}): Promise<{ categories: CategoryWithLineItems[] | null; error: Error | null }> {
  if (!householdId) {
    return { categories: null, error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data, error } = await supabase
    .from("categories")
    .select("*, line_items(*)")
    .eq("household_id", householdId)
    .eq("year", yearNumber)
    .eq("month", monthNumber);

  if (error) {
    return { categories: null, error: error as Error };
  }
  return { categories: (data as CategoryWithLineItems[]) ?? null, error: null };
}
