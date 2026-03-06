import { useLogError } from '@/hooks/useLogError';
import { deleteLineItem } from '@/lib/mutations/deleteLineItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteLineItem() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { lineItemId: string }) => {
      const { error } = await deleteLineItem(params);
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
