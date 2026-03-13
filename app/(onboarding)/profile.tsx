import { OnboardingBackground } from '@/components/OnboardingBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile';
import { profileSchema, type ProfileFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { updateUserProfileAsync } = useUpdateUserProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormData) {
    if (!user) return;
    try {
      await updateUserProfileAsync({
        userId: user.id,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      });
    } catch {
      return;
    }
    router.push('/(onboarding)/household');
  }

  return (
    <OnboardingBackground>
      <View className="flex-1 justify-between px-6 pb-16 pt-20">
        <View className="gap-8">
          <StepIndicator currentStep={1} totalSteps={3} />
          <View className="gap-4">
            <Text className="text-center text-2xl font-bold">
              What's your name?
            </Text>
            <Controller
              control={form.control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="First name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoFocus
                  autoCapitalize="words"
                />
              )}
            />
            <Controller
              control={form.control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Last name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              )}
            />
          </View>
        </View>
        <View className="gap-3">
          <Button onPress={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid || form.formState.isSubmitting}>
            <Text>Next</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.push('/(onboarding)/household')}>
            <Text>Skip</Text>
          </Button>
        </View>
      </View>
    </OnboardingBackground>
  );
}
