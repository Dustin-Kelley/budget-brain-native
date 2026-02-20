import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";

export async function getTotalIncome({
  date,
  householdId,
  userId,
}: {
  date: string | undefined;
  householdId: string | null;
  userId: string;
}): Promise<{
  income: { id: string; name: string | null; amount: number }[];
  totalIncome: number;
  error: Error | null;
}> {
  if (!householdId) {
    return { income: [], totalIncome: 0, error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data, error } = await supabase
    .from("income")
    .select("id, name, amount")
    .eq("household_id", householdId)
    .eq("created_by", userId)
    .eq("year", yearNumber)
    .eq("month", monthNumber);

  if (error) {
    return { income: [], totalIncome: 0, error: error as Error };
  }

  const income = (data ?? []) as { id: string; name: string | null; amount: number }[];
  const totalIncome = income.reduce((sum, row) => sum + (row.amount ?? 0), 0);
  return { income, totalIncome, error: null };
}
