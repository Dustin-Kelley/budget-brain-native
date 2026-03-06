import { useLogError } from '@/hooks/useLogError';
import { updateTransaction } from '@/lib/mutations/updateTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateTransaction() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      transactionId: string;
      amount: number;
      description?: string;
      lineItemId: string;
      dateOfTransaction: string;
      monthKey: string;
      householdId: string;
      userId: string;
    }) => {
      const { error } = await updateTransaction(params);
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
