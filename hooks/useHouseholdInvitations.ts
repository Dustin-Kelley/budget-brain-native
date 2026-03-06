import { getHouseholdInvitations } from '@/lib/queries/getHouseholdInvitations';
import { useQuery } from '@tanstack/react-query';

export function useHouseholdInvitations(householdId: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['householdInvitations', householdId],
    queryFn: async () => {
      const { invitations, error } = await getHouseholdInvitations({
        householdId: householdId!,
      });
      if (error) throw error;
      return { invitations };
    },
    enabled: !!householdId,
  });

  return {
    invitations: data?.invitations ?? [],
    isLoading,
  };
}
