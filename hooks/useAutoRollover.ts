import { useMonth } from '@/contexts/month-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useHousehold } from '@/hooks/useHousehold';
import { autoRolloverBudget } from '@/lib/mutations/autoRolloverBudget';
import { findMostRecentBudgetMonth } from '@/lib/queries/findMostRecentBudgetMonth';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type RolloverResult =
  | { success: true }
  | { success: false; reason: 'no-source' | 'error' };

export function useRolloverBudget() {
  const { monthKey } = useMonth();
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();
  const queryClient = useQueryClient();

  const [isRollingOver, setIsRollingOver] = useState(false);

  async function rollover(): Promise<RolloverResult> {
    if (!householdId || !currentUser?.id) {
      return { success: false, reason: 'error' };
    }

    setIsRollingOver(true);
    try {
      const sourceMonth = await findMostRecentBudgetMonth(householdId, monthKey);
      if (!sourceMonth) {
        return { success: false, reason: 'no-source' };
      }

      const { error } = await autoRolloverBudget({
        householdId,
        fromMonthKey: sourceMonth,
        toMonthKey: monthKey,
        userId: currentUser.id,
      });

      if (error) {
        return { success: false, reason: 'error' };
      }

      await queryClient.invalidateQueries();
      return { success: true };
    } finally {
      setIsRollingOver(false);
    }
  }

  return { rollover, isRollingOver };
}
