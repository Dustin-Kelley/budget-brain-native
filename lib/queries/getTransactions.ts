import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";

/** Transactions for the month. Used to derive spentByLineItem. */
export async function getTransactions({
  date,
  householdId,
}: {
  date: string | undefined;
  householdId: string | null;
}): Promise<{
  transactions: { line_item_id: string | null; amount: number | null }[];
  error: Error | null;
}> {
  if (!householdId) {
    return { transactions: [], error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data, error } = await supabase
    .from("transactions")
    .select("line_item_id, amount")
    .eq("household_id", householdId)
    .eq("month", monthNumber)
    .eq("year", yearNumber);

  if (error) {
    return { transactions: [], error };
  }

  const transactions = (data ?? [])
  return { transactions, error: null };
}
