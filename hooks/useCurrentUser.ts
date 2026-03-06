import { useAuth } from '@/contexts/auth-context';
import { getCurrentUser } from '@/lib/queries/getCurrentUser';
import { useQuery } from '@tanstack/react-query';

export function useCurrentUser() {
  const { user: authUser, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['currentUser', authUser?.id],
    queryFn: async () => {
      const { currentUser, error } = await getCurrentUser(authUser!.id);
      if (error) throw error;
      return { currentUser };
    },
    enabled: !!authUser?.id,
  });

  return {
    currentUser: data?.currentUser ?? null,
    isCurrentUserLoading: authLoading || (!!authUser && isLoading),
  };
}
