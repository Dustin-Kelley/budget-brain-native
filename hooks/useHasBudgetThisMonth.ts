import { useBudgetOverview } from "@/hooks/useBudgetOverview";

/**
 * Returns whether the current user's household has a budget for the current month
 * (i.e. at least one category exists).
 */
export function useHasBudgetThisMonth() {
  const { categories, isLoading, error } = useBudgetOverview();

  return {
    hasBudgetThisMonth: (categories?.length ?? 0) > 0,
    isLoading,
    error,
  };
}
