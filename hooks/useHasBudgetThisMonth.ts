import { useBudgetOverview } from "@/hooks/useBudgetOverview";

/**
 * Returns whether the current user's household has a budget for the current month
 * (i.e. at least one category with planned amount > 0).
 */
export function useHasBudgetThisMonth() {
  const { totalPlanned, isLoading, error } = useBudgetOverview();

  return {
    hasBudgetThisMonth: totalPlanned > 0,
    isLoading,
    error,
  };
}
