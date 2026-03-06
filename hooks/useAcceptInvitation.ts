import { useLogError } from '@/hooks/useLogError';
import { acceptHouseholdInvitation } from '@/lib/mutations/acceptHouseholdInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAcceptInvitation() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      invitationId: string;
      userId: string;
      householdId: string;
    }) => {
      const { error } = await acceptHouseholdInvitation(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'household' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['household'] });
      queryClient.invalidateQueries({ queryKey: ['householdMembers'] });
    },
  });
}
