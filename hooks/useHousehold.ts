import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getHousehold } from '@/lib/queries/getHousehold';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useHousehold() {
  const { currentUser, isCurrentUserLoading } = useCurrentUser();
  const householdId = currentUser?.household_id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ['household', householdId],
    queryFn: async () => {
      const { household, error } = await getHousehold(householdId);
      return { household, error };
    },
    enabled: !!householdId,
  });

  return {
    householdId,
    household: data?.household ?? null,
    isLoading: isCurrentUserLoading || isLoading,
  };
}

export const useInvalidateHousehold = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['household'] });
  };
};
