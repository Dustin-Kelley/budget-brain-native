import { useLogError } from '@/hooks/useLogError';
import { deleteCategory } from '@/lib/mutations/deleteCategory';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteCategory() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { categoryId: string }) => {
      const { error } = await deleteCategory(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'categories' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
