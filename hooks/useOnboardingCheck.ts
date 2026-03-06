import { useAuth } from '@/contexts/auth-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const ONBOARDING_KEY = 'budget-brain-onboarding-completed';

export function useOnboardingCheck() {
  const { user: authUser } = useAuth();
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const [flagChecked, setFlagChecked] = useState(false);
  const [flagValue, setFlagValue] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setFlagValue(value);
      setFlagChecked(true);
    });
  }, []);

  const isLoading = userLoading || !flagChecked;

  // Needs onboarding if:
  // - DB row doesn't exist yet (new user, trigger still running)
  // - DB row exists but first_name is null (never completed onboarding)
  // In both cases, skip if the AsyncStorage flag is already set
  const needsOnboarding =
    !isLoading &&
    !!authUser &&
    (currentUser === null || currentUser.first_name === null) &&
    flagValue !== 'true';

  return { needsOnboarding, isLoading };
}
