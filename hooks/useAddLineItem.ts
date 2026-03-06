import { useLogError } from '@/hooks/useLogError';
import { addLineItem } from '@/lib/mutations/addLineItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddLineItem() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      lineItemName: string;
      categoryId: string;
      plannedAmount: number;
      monthKey: string;
      userId: string;
    }) => {
      const { error } = await addLineItem(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'line-items' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
