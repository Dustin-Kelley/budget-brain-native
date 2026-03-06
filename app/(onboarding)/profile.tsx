import { OnboardingBackground } from '@/components/OnboardingBackground';
import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { updateUserProfile } from '@/lib/mutations/updateUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  async function handleNext() {
    if (!firstName.trim() || !user) return;
    setSaving(true);
    const { error } = await updateUserProfile({
      userId: user.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setSaving(false);
    if (error) return;
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    router.push('/(onboarding)/household');
  }

  return (
    <OnboardingBackground>
      <View className="flex-1 justify-between px-6 pb-12 pt-20">
        <View className="gap-8">
          <StepIndicator currentStep={1} totalSteps={3} />
          <View className="gap-4">
            <Text className="text-center text-2xl font-bold">
              What's your name?
            </Text>
            <Input
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoFocus
              autoCapitalize="words"
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>
        </View>
        <View className="gap-3">
          <Button onPress={handleNext} disabled={!firstName.trim() || saving}>
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
