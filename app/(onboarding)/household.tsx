import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useHousehold } from '@/hooks/useHousehold';
import { updateHouseholdName } from '@/lib/mutations/updateHouseholdName';
import { householdSchema, type HouseholdFormData } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function HouseholdScreen() {
  const { householdId } = useHousehold();
  const queryClient = useQueryClient();

  const form = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  async function onSubmit(data: HouseholdFormData) {
    if (!householdId) return;
    const { error } = await updateHouseholdName({
      householdId,
      name: data.name,
    });
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['household'] });
    router.push('/(onboarding)/welcome');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-between px-6 pb-12 pt-20">
        <View className="gap-8">
          <StepIndicator currentStep={2} totalSteps={3} />
          <View className="gap-2">
            <Text className="text-center text-2xl font-bold">Name your household</Text>
            <Text className="text-center text-muted-foreground">
              This helps you organize your budget
            </Text>
          </View>
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
        <View className="gap-3">
          <Button onPress={form.handleSubmit(onSubmit)} disabled={!form.formState.isValid || form.formState.isSubmitting}>
            <Text>Next</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.push('/(onboarding)/welcome')}>
            <Text>Skip</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
