import { useLogError } from '@/hooks/useLogError';
import { addIncome } from '@/lib/mutations/addIncome';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddIncome() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      incomeName: string;
      incomeAmount: number;
      monthKey: string;
      householdId: string;
      userId: string;
    }) => {
      const { error } = await addIncome(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'income' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
