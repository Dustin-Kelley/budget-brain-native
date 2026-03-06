import { useLogError } from '@/hooks/useLogError';
import { addTransaction } from '@/lib/mutations/addTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddTransaction() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      amount: number;
      description?: string;
      lineItemId: string;
      dateOfTransaction: string;
      householdId: string;
      userId: string;
      monthKey: string;
    }) => {
      const { error } = await addTransaction(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'transactions' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
