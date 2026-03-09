import { useLogError } from '@/hooks/useLogError';
import { updateIncomeTransaction } from '@/lib/mutations/updateIncomeTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateIncomeTransaction() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      transactionId: string;
      amount: number;
      description?: string;
      dateOfTransaction: string;
    }) => {
      const { error } = await updateIncomeTransaction(params);
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
