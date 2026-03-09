import { useLogError } from '@/hooks/useLogError';
import { deleteIncomeTransaction } from '@/lib/mutations/deleteIncomeTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteIncomeTransaction() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { transactionId: string }) => {
      const { error } = await deleteIncomeTransaction(params);
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
