import { useQuery } from "@tanstack/react-query";
import { useHousehold } from "@/hooks/useHousehold";
import { useMonth } from "@/contexts/month-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCategories } from "@/lib/queries/getCategories";
import { getTotalIncome } from "@/lib/queries/getTotalIncome";
import { getTransactions } from "@/lib/queries/getTransactions";
import { getTransactionsList } from "@/lib/queries/getTransactionsList";

function totalPlannedFromCategories(
  categories: { line_items?: { planned_amount: number | null }[] }[] | null
): number {
  if (!categories) return 0;
  return categories.reduce((sum, cat) => {
    const lineTotal = (cat.line_items ?? []).reduce(
      (s, item) => s + (item.planned_amount ?? 0),
      0
    );
    return sum + lineTotal;
  }, 0);
}

export function useBudgetPlan() {
  const { householdId } = useHousehold();
  const { currentUser } = useCurrentUser();
  const { monthKey } = useMonth();
  const userId = currentUser?.id ?? "";

  const categoriesQuery = useQuery({
    queryKey: ["plan-categories", householdId, monthKey],
    queryFn: () => getCategories({ date: monthKey, householdId }),
    enabled: !!householdId,
  });

  const incomeQuery = useQuery({
    queryKey: ["plan-income", householdId, monthKey, userId],
    queryFn: () =>
      getTotalIncome({ date: monthKey, householdId, userId }),
    enabled: !!householdId && !!userId,
  });

  const transactionsQuery = useQuery({
    queryKey: ["plan-transactions", householdId, monthKey],
    queryFn: () => getTransactions({ date: monthKey, householdId }),
    enabled: !!householdId,
  });

  const transactionsListQuery = useQuery({
    queryKey: ["plan-transactions-list", householdId, monthKey],
    queryFn: () => getTransactionsList({ date: monthKey, householdId }),
    enabled: !!householdId,
  });

  const categories = categoriesQuery.data?.categories ?? null;
  const income = incomeQuery.data?.income ?? [];
  const totalIncome = incomeQuery.data?.totalIncome ?? 0;
  const totalPlanned = totalPlannedFromCategories(categories);
  const remaining = totalIncome - totalPlanned;

  const transactions = transactionsQuery.data?.transactions ?? [];
  const spentByLineItem = transactions.reduce(
    (acc, tx) => {
      const lid = tx.line_item_id;
      if (lid) {
        acc[lid] = (acc[lid] ?? 0) + (tx.amount ?? 0);
      }
      return acc;
    },
    {} as Record<string, number>
  );
  const spentByLineItemArray = Object.entries(spentByLineItem).map(
    ([line_item_id, spent]) => ({ line_item_id, spent })
  );

  const { groupedTransactions, sortedDates } =
    transactionsListQuery.data ?? {
      groupedTransactions: {} as Record<string, unknown[]>,
      sortedDates: [] as string[],
    };

  const isLoading =
    categoriesQuery.isLoading ||
    incomeQuery.isLoading ||
    transactionsQuery.isLoading ||
    transactionsListQuery.isLoading;

  const error =
    categoriesQuery.error ??
    incomeQuery.error ??
    transactionsQuery.error ??
    transactionsListQuery.error;

  return {
    categories,
    income,
    totalIncome,
    totalPlanned,
    remaining,
    spentByLineItem: spentByLineItemArray,
    groupedTransactions: groupedTransactions as Record<
      string,
      { id?: string; amount: number | null; date: string | null; description: string | null; line_items?: { name?: string | null } }[]
    >,
    sortedDates,
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => {
      categoriesQuery.refetch();
      incomeQuery.refetch();
      transactionsQuery.refetch();
      transactionsListQuery.refetch();
    },
  };
}
