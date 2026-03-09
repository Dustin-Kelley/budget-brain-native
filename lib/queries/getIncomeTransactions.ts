import { logError } from "@/hooks/useLogError";
import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";

export async function getIncomeTransactions({
  date,
  householdId,
}: {
  date: string | undefined;
  householdId: string | null;
}): Promise<{
  incomeTransactions: {
    id: string;
    income_id: string;
    amount: number;
    date: string | null;
    description: string | null;
  }[];
  totalReceived: number;
  receivedByIncomeId: Record<string, number>;
  error: Error | null;
}> {
  if (!householdId) {
    return { incomeTransactions: [], totalReceived: 0, receivedByIncomeId: {}, error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data, error } = await supabase
    .from("income_transactions")
    .select("id, income_id, amount, date, description")
    .eq("household_id", householdId)
    .eq("month", monthNumber)
    .eq("year", yearNumber);

  if (error) {
    logError(error, { tags: { query: "getIncomeTransactions" } });
    return { incomeTransactions: [], totalReceived: 0, receivedByIncomeId: {}, error };
  }

  const incomeTransactions = (data ?? []) as {
    id: string;
    income_id: string;
    amount: number;
    date: string | null;
    description: string | null;
  }[];

  const totalReceived = incomeTransactions.reduce((sum, tx) => sum + (tx.amount ?? 0), 0);

  const receivedByIncomeId = incomeTransactions.reduce(
    (acc, tx) => {
      acc[tx.income_id] = (acc[tx.income_id] ?? 0) + (tx.amount ?? 0);
      return acc;
    },
    {} as Record<string, number>
  );

  return { incomeTransactions, totalReceived, receivedByIncomeId, error: null };
}
