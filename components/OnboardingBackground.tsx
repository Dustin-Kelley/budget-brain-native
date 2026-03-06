import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export function OnboardingBackground({ children }: { children: ReactNode }) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
