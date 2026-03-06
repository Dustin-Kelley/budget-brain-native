import { useMonth } from '@/contexts/month-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useHousehold } from '@/hooks/useHousehold';
import { autoRolloverBudget } from '@/lib/mutations/autoRolloverBudget';
import { findMostRecentBudgetMonth } from '@/lib/queries/findMostRecentBudgetMonth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLogError } from './useLogError';

export type RolloverResult =
  | { success: true }
  | { success: false; reason: 'no-source' | 'error' };

export function useRolloverBudget() {
  const { logError } = useLogError();
  const { monthKey } = useMonth();
  const { currentUser } = useCurrentUser();
  const { householdId } = useHousehold();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (): Promise<void> => {
      if (!householdId || !currentUser?.id) {
        throw new Error('Missing household or user');
      }
      const sourceMonth = await findMostRecentBudgetMonth(
        householdId,
        monthKey,
      );
      if (!sourceMonth) {
        throw new Error('No previous budget found to roll over.');
      }
      const { error } = await autoRolloverBudget({
        householdId,
        fromMonthKey: sourceMonth,
        toMonthKey: monthKey,
        userId: currentUser.id,
      });
      if (error) {
        throw error;
      }
    },

    onError: (error) => {
      logError(error, {
        tags: { feature: 'rollover' },
        extra: { monthKey },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return { rollover: mutateAsync, isRollingOver: isPending, isError };
}
