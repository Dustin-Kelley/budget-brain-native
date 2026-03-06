import { useLogError } from '@/hooks/useLogError';
import { updateLineItem } from '@/lib/mutations/updateLineItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLineItem() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      lineItemId: string;
      lineItemName: string;
      categoryId: string;
      plannedAmount: number;
    }) => {
      const { error } = await updateLineItem(params);
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
