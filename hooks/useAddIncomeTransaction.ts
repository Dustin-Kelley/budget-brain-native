import { useLogError } from '@/hooks/useLogError';
import { addIncomeTransaction } from '@/lib/mutations/addIncomeTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddIncomeTransaction() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      amount: number;
      description?: string;
      dateOfTransaction: string;
      incomeId: string;
      householdId: string;
      userId: string;
      monthKey: string;
    }) => {
      const { error } = await addIncomeTransaction(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'income-transactions' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
