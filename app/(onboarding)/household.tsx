import { OnboardingBackground } from '@/components/OnboardingBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useHousehold } from '@/hooks/useHousehold';
import { updateHouseholdName } from '@/lib/mutations/updateHouseholdName';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function HouseholdScreen() {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const { householdId } = useHousehold();
  const queryClient = useQueryClient();

  async function handleNext() {
    if (!name.trim() || !householdId) return;
    setSaving(true);
    const { error } = await updateHouseholdName({
      householdId,
      name: name.trim(),
    });
    setSaving(false);
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['household'] });
    router.push('/(onboarding)/welcome');
  }

  return (
    <OnboardingBackground>
      <View className="flex-1 justify-between px-6 pb-12 pt-20">
        <View className="gap-8">
          <Button onPress={() => router.back()} variant="outline" size="icon">
            <Ionicons name="arrow-back" size={24} className="text-foreground" />
          </Button>
          <StepIndicator currentStep={2} totalSteps={3} />
          <View className="gap-4">
            <Text className="text-center text-2xl font-bold">
              Name your household
            </Text>
            <Text className="text-center text-muted-foreground">
              This helps you organize your budget
            </Text>
            <Input
              placeholder="Household name"
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
            />
          </View>
        </View>
        <View className="gap-3">
          <Button onPress={handleNext} disabled={!name.trim() || saving}>
            <Text>Next</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.push('/(onboarding)/welcome')}>
            <Text>Skip</Text>
          </Button>
        </View>
      </View>
    </OnboardingBackground>
  );
}
