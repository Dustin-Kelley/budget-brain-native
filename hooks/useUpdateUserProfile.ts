import { useLogError } from '@/hooks/useLogError';
import { updateUserProfile } from '@/lib/mutations/updateUserProfile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateUserProfile() {
  const { logError } = useLogError();
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      userId,
      firstName,
      lastName,
      avatarEmoji,
    }: {
      userId: string;
      firstName: string;
      lastName: string;
      avatarEmoji?: string | null;
    }) => {
      await updateUserProfile({
        userId,
        firstName,
        lastName,
        avatarEmoji,
      });
    },
    onError: (error) => {
      logError(error, { tags: { feature: 'user-profile' } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  return { updateUserProfile: mutate, updateUserProfileAsync: mutateAsync, isUpdatingUserProfile: isPending };
}

export function useInvalidateUserProfile() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };
}
