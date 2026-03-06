import { OnboardingBackground } from '@/components/OnboardingBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
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
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  async function handleNext() {
    if (!name.trim() || !user) return;
    setSaving(true);
    const { error } = await createHouseholdForUser(user.id, name.trim());
    setSaving(false);
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    await queryClient.invalidateQueries({ queryKey: ['household'] });
    router.push('/(onboarding)/welcome');
  }

  async function handleSkip() {
    if (!user) return;
    setSaving(true);
    const { error } = await createHouseholdForUser(user.id, null);
    setSaving(false);
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
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
          <Button variant="ghost" onPress={handleSkip} disabled={saving}>
            <Text>Skip</Text>
          </Button>
        </View>
      </View>
    </OnboardingBackground>
  );
}
