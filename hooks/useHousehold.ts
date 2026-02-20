import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getHousehold } from '@/lib/queries/getHousehold';
import { useQuery } from '@tanstack/react-query';

export function useHousehold() {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const householdId = currentUser?.household_id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ['household', householdId],
    queryFn: () => getHousehold(householdId),
    enabled: !!householdId,
  });

  return {
    householdId,
    household: data?.household ?? null,
    isLoading: userLoading || isLoading,
  };
}
