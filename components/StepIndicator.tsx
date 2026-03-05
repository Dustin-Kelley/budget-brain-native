import { useTheme } from '@/contexts/theme-context';
import { getAppTheme } from '@/lib/themes';
import { blendHex } from '@/lib/utils';
import { View } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);

  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <View
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: i + 1 === currentStep ? accentColor : '#9ca3af',
          }}
        />
      ))}
    </View>
  );
}
