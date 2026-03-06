import { BackButton } from '@/components/BackButton';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { householdSchema, type HouseholdFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

async function createHouseholdForUser(userId: string, name: string | null) {
  const { data: household, error: hError } = await supabase
    .from('household')
    .insert({ name })
    .select('id')
    .single();
  if (hError) return { error: hError as Error };

  const { error: uError } = await supabase
    .from('users')
    .update({ household_id: household.id })
    .eq('id', userId);
  if (uError) return { error: uError as Error };

  return { error: null };
}

export default function HouseholdScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [skipping, setSkipping] = useState(false);

  const form = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: HouseholdFormData) {
    if (!user) return;
    const { error } = await createHouseholdForUser(user.id, data.name.trim());
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    await queryClient.invalidateQueries({ queryKey: ['household'] });
    router.push('/(onboarding)/welcome');
  }

  async function handleSkip() {
    if (!user) return;
    setSkipping(true);
    const { error } = await createHouseholdForUser(user.id, null);
    setSkipping(false);
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    router.push('/(onboarding)/welcome');
  }

  return (
    <OnboardingBackground>
      <View className="flex-1 justify-between px-6 pb-16 pt-20">
        <View className="gap-8">
          <BackButton />
          <StepIndicator currentStep={2} totalSteps={3} />
          <View className="gap-4">
            <Text className="text-center text-2xl font-bold">
              Name your household
            </Text>
            <Text className="text-center text-muted-foreground">
              This helps you organize your budget
            </Text>
            <Controller
              control={form.control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Household name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoFocus
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
          <Button variant="ghost" onPress={handleSkip} disabled={skipping}>
            <Text>Skip</Text>
          </Button>
        </View>
      </View>
    </OnboardingBackground>
  );
}
