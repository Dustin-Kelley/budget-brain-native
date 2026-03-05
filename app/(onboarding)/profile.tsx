import { StepIndicator } from '@/components/StepIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { updateUserProfile } from '@/lib/mutations/updateUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function ProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  async function handleNext() {
    if (!firstName.trim() || !currentUser) return;
    setSaving(true);
    const { error } = await updateUserProfile({
      userId: currentUser.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setSaving(false);
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
            <Input
              className="h-auto rounded-lg px-4 py-3"
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoFocus
              autoCapitalize="words"
            />
            <Input
              className="h-auto rounded-lg px-4 py-3"
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
    </KeyboardAvoidingView>
  );
}
