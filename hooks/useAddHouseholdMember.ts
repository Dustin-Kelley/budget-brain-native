import { useLogError } from '@/hooks/useLogError';
import { addHouseholdMember } from '@/lib/mutations/addHouseholdMember';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddHouseholdMember() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      email: string;
      householdId: string;
    }) => {
      const { error } = await addHouseholdMember(params);
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
