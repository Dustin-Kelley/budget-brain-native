import { useLogError } from '@/hooks/useLogError';
import { removeHouseholdMember } from '@/lib/mutations/removeHouseholdMember';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRemoveHouseholdMember() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string }) => {
      const { error } = await removeHouseholdMember(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'household' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['householdMembers'] });
    },
  });
}
