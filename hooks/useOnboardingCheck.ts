import { useAuth } from '@/contexts/auth-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEnsureUserRow } from '@/hooks/useEnsureUserRow';

export function useOnboardingCheck() {
  const { user: authUser } = useAuth();
  const { isSuccess: userRowReady } = useEnsureUserRow();
  const { currentUser, isCurrentUserLoading: userLoading } = useCurrentUser();

  const isLoading = !userRowReady || userLoading;

  // Needs onboarding if user has no household linked
  const needsOnboarding =
    !isLoading &&
    !!authUser &&
    (currentUser === null || currentUser.household_id === null);

  return { needsOnboarding, isLoading };
}
