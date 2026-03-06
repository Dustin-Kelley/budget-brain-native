import { useLogError } from '@/hooks/useLogError';
import { deleteTransaction } from '@/lib/mutations/deleteTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteTransaction() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { transactionId: string }) => {
      const { error } = await deleteTransaction(params);
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
