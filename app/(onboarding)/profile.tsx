import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { updateUserProfile } from '@/lib/mutations/updateUserProfile';
import { profileSchema, type ProfileFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function ProfileScreen() {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: ProfileFormData) {
    if (!currentUser) return;
    const { error } = await updateUserProfile({
      userId: currentUser.id,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    router.push('/(onboarding)/household');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-between px-6 pb-12 pt-20">
        <View className="gap-8">
          <StepIndicator currentStep={1} totalSteps={3} />
          <View className="gap-4">
            <Text className="text-center text-2xl font-bold">What's your name?</Text>
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
    </KeyboardAvoidingView>
  );
}
