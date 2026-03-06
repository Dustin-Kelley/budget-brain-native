import { useMonth } from "@/contexts/month-context";
import { useHousehold } from "@/hooks/useHousehold";
import { getCategories } from "@/lib/queries/getCategories";
import { getSpentAmount } from "@/lib/queries/getSpentAmount";
import { getSpentByCategory } from "@/lib/queries/getSpentByCategory";
import { useQuery } from "@tanstack/react-query";

/** Total planned = sum of all line_items.planned_amount for the month. */
function totalPlannedFromCategories(
  categories: { line_items?: { planned_amount: number | null }[] }[] | null,
): number {
  if (!categories) return 0;
  return categories.reduce((sum, category) => {
    const lineTotal = (category.line_items ?? []).reduce(
      (lineSum, item) => lineSum + (item.planned_amount ?? 0),
      0,
    );
    return sum + lineTotal;
  }, 0);
}

export function useBudgetOverview() {
  const { householdId } = useHousehold();
  const { monthKey } = useMonth();

  const categoriesQuery = useQuery({
    queryKey: ['categories', householdId, monthKey],
    queryFn: async () => {
      const { categories, error } = await getCategories({ date: monthKey, householdId });
      if (error) throw error;
      return { categories };
    },
    enabled: !!householdId,
  });

  const spentQuery = useQuery({
    queryKey: ['spentAmount', householdId, monthKey],
    queryFn: async () => {
      const { spentAmount, error } = await getSpentAmount({ date: monthKey, householdId });
      if (error) throw error;
      return { spentAmount };
    },
    enabled: !!householdId,
  });

  const spentByCategoryQuery = useQuery({
    queryKey: ['spentByCategory', householdId, monthKey],
    queryFn: async () => {
      const { categorySpent, error } = await getSpentByCategory({ date: monthKey, householdId });
      if (error) throw error;
      return { categorySpent };
    },
    enabled: !!householdId,
  });

  const categories = categoriesQuery.data?.categories ?? null;
  const totalPlanned = totalPlannedFromCategories(categories);
  const spentAmount = spentQuery.data?.spentAmount ?? 0;
  const categorySpent = spentByCategoryQuery.data?.categorySpent ?? [];
  const remaining = totalPlanned - spentAmount;
  const percentSpent =
    totalPlanned > 0 ? Math.round((spentAmount / totalPlanned) * 100) : 0;

  const isLoading =
    categoriesQuery.isLoading ||
    spentQuery.isLoading ||
    spentByCategoryQuery.isLoading;
  const error =
    categoriesQuery.error ??
    spentQuery.error ??
    spentByCategoryQuery.error;

  return {
    categories,
    totalPlanned,
    spentAmount,
    remaining,
    percentSpent,
    categorySpent,
    isLoading,
    error: error instanceof Error ? error : null,
    refetch: () => {
      categoriesQuery.refetch();
      spentQuery.refetch();
      spentByCategoryQuery.refetch();
    },
  };
}
