import { useLogError } from '@/hooks/useLogError';
import { deleteIncome } from '@/lib/mutations/deleteIncome';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteIncome() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { incomeId: string }) => {
      const { error } = await deleteIncome(params);
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
