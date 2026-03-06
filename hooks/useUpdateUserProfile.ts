import { useLogError } from '@/hooks/useLogError';
import { updateUserProfile } from '@/lib/mutations/updateUserProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUserProfile() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      userId: string;
      firstName: string;
      lastName: string;
      avatarEmoji?: string | null;
    }) => {
      const { error } = await updateUserProfile(params);
      if (error) throw error;
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'user-profile' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}
