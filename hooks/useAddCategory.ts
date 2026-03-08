import { useLogError } from '@/hooks/useLogError';
import { addCategory } from '@/lib/mutations/addCategory';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddCategory() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      categoryName: string;
      monthKey: string;
      householdId: string;
      color?: string;
    }) => {
      await addCategory(params);
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'categories' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
