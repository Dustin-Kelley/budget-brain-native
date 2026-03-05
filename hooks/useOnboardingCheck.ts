import { useCurrentUser } from '@/hooks/useCurrentUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const ONBOARDING_KEY = 'budget-brain-onboarding-completed';

export function useOnboardingCheck() {
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

  const needsOnboarding =
    !isLoading &&
    currentUser !== null &&
    currentUser.first_name === null &&
    flagValue !== 'true';

  return { needsOnboarding, isLoading };
}
