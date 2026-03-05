import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/auth-context";
import { useOnboardingCheck } from "@/hooks/useOnboardingCheck";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, isLoading } = useAuth();
  const { needsOnboarding, isLoading: onboardingLoading } = useOnboardingCheck();

  if (isLoading || (user && onboardingLoading)) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (needsOnboarding) {
    return <Redirect href="/(onboarding)/profile" />;
  }

  return <Redirect href="/(app)" />;
}
