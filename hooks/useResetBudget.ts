import { useLogError } from '@/hooks/useLogError';
import { resetBudget } from '@/lib/mutations/resetBudget';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useResetBudget() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      householdId: string;
      monthKey: string;
    }) => {
      const { error } = await resetBudget(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'budget-reset' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
