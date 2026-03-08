import { useLogError } from '@/hooks/useLogError';
import { updateCategory } from '@/lib/mutations/updateCategory';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCategory() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      categoryId: string;
      name: string;
      color?: string;
    }) => {
      const { error } = await updateCategory(params);
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
