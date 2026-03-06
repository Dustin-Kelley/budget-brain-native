import { useLogError } from '@/hooks/useLogError';
import { cancelHouseholdInvitation } from '@/lib/mutations/cancelHouseholdInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCancelInvitation() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { invitationId: string }) => {
      const { error } = await cancelHouseholdInvitation(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'household' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['householdInvitations'] });
    },
  });
}
