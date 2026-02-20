import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";

export async function getSpentAmount({
  date,
  householdId,
}: {
  date: string | undefined;
  householdId: string | null;
}): Promise<{ spentAmount: number; error: Error | null }> {
  if (!householdId) {
    return { spentAmount: 0, error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount")
    .eq("household_id", householdId)
    .eq("month", monthNumber)
    .eq("year", yearNumber);

  if (error) {
    return { spentAmount: 0, error: error as Error };
  }

  const spentAmount = (data ?? []).reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0
  );
  return { spentAmount, error: null };
}
