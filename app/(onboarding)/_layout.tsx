import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useEnsureUserRow } from '@/hooks/useEnsureUserRow';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  const { isSuccess, isLoading } = useEnsureUserRow();

  if (isLoading || !isSuccess) {
    return <LoadingSpinner />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
