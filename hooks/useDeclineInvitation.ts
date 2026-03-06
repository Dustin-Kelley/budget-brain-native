import { useLogError } from '@/hooks/useLogError';
import { declineHouseholdInvitation } from '@/lib/mutations/declineHouseholdInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeclineInvitation() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { invitationId: string }) => {
      const { error } = await declineHouseholdInvitation(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'household' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingInvitesForUser'] });
    },
  });
}
