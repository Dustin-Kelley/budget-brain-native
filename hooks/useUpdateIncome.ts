import { useLogError } from '@/hooks/useLogError';
import { updateIncome } from '@/lib/mutations/updateIncome';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateIncome() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      incomeId: string;
      name: string;
      amount: number;
    }) => {
      const { error } = await updateIncome(params);
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
