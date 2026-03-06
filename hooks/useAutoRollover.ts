import { useMonth } from '@/contexts/month-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useHousehold } from '@/hooks/useHousehold';
import { useBudgetOverview } from '@/hooks/useBudgetOverview';
import { findMostRecentBudgetMonth } from '@/lib/queries/findMostRecentBudgetMonth';
import { autoRolloverBudget } from '@/lib/mutations/autoRolloverBudget';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

export function useAutoRollover() {
  const { monthKey } = useMonth();
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();
  const { totalPlanned, isLoading: budgetLoading } = useBudgetOverview();
  const queryClient = useQueryClient();

  const [isRollingOver, setIsRollingOver] = useState(false);
  const attemptedMonths = useRef(new Set<string>());

  useEffect(() => {
    if (
      budgetLoading ||
      !householdId ||
      !currentUser?.id ||
      totalPlanned > 0 ||
      attemptedMonths.current.has(monthKey)
    ) {
      return;
    }

    attemptedMonths.current.add(monthKey);

    let cancelled = false;

    async function run() {
      setIsRollingOver(true);
      try {
        const sourceMonth = await findMostRecentBudgetMonth(householdId!, monthKey);
        if (!sourceMonth || cancelled) return;

        const { error } = await autoRolloverBudget({
          householdId: householdId!,
          fromMonthKey: sourceMonth,
          toMonthKey: monthKey,
          userId: currentUser!.id,
        });

        if (error || cancelled) return;

        await queryClient.invalidateQueries();
      } finally {
        if (!cancelled) setIsRollingOver(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [monthKey, budgetLoading, householdId, currentUser?.id, totalPlanned, queryClient]);

  return { isRollingOver };
}
