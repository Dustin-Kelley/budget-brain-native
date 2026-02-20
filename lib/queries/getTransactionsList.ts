import { supabase } from "@/lib/supabase";
import { getMonthAndYearNumberFromDate } from "@/lib/utils";
import type { TransactionWithLineItem } from "@/types";

function groupTransactionsByDate(transactions: TransactionWithLineItem[]) {
  return transactions.reduce(
    (groups: Record<string, TransactionWithLineItem[]>, transaction) => {
      const dateKey = transaction.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : "Unknown Date";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(transaction);
      return groups;
    },
    {}
  );
}

export async function getTransactionsList({
  date,
  householdId,
}: {
  date: string | undefined;
  householdId: string | null;
}): Promise<{
  groupedTransactions: Record<string, TransactionWithLineItem[]>;
  sortedDates: string[];
  error: Error | null;
}> {
  if (!householdId) {
    return { groupedTransactions: {}, sortedDates: [], error: null };
  }

  const { monthNumber, yearNumber } = getMonthAndYearNumberFromDate(date);

  const { data, error } = await supabase
    .from("transactions")
    .select("*, line_items(*, categories(*))")
    .eq("household_id", householdId)
    .eq("month", monthNumber)
    .eq("year", yearNumber)
    .order("date", { ascending: false });

  if (error) {
    return { groupedTransactions: {}, sortedDates: [], error: error as Error };
  }

  const transactions = (data ?? []) as TransactionWithLineItem[];
  const groupedTransactions = groupTransactionsByDate(transactions);
  const sortedDates = Object.keys(groupedTransactions).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return { groupedTransactions, sortedDates, error: null };
}
