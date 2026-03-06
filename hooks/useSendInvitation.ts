import { useLogError } from '@/hooks/useLogError';
import { sendHouseholdInvitation } from '@/lib/mutations/sendHouseholdInvitation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSendInvitation() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      householdId: string;
      invitedBy: string;
      email: string;
      householdName: string | null;
      inviterName: string | null;
    }) => {
      const { error } = await sendHouseholdInvitation(params);
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
