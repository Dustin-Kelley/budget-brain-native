import { getPendingInvitesForUser } from '@/lib/queries/getPendingInvitesForUser';
import { useQuery } from '@tanstack/react-query';

export function usePendingInvitesForUser(email: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['pendingInvitesForUser', email],
    queryFn: async () => {
      const { invitations, error } = await getPendingInvitesForUser({
        email: email!,
      });
      if (error) throw error;
      return { invitations };
    },
    enabled: !!email,
  });

  return {
    invitations: data?.invitations ?? [],
    isLoading,
  };
}
