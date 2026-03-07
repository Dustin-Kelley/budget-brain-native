import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex, formatCurrency, hexToRgba } from "@/lib/utils";
import { View } from "react-native";

type BudgetProgressCardProps = {
  totalPlanned: number;
  spentAmount: number;
  percentSpent: number;
  error?: string | null;
};

export function BudgetProgressCard({
  totalPlanned,
  spentAmount,
  percentSpent,
  error,
}: BudgetProgressCardProps) {
  const { appTheme } = useTheme();

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-800">
          Overall Budget Progress
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading progress</Text>
      </Card>
    );
  }

  const theme = getAppTheme(appTheme);
  const progressWidth = Math.min(percentSpent, 100);

  return (
    <Card className="gap-0 p-5">
      <Text className="text-base font-semibold tracking-tight text-gray-800">
        Overall Budget Progress
      </Text>
      <Text className="mt-1 text-sm text-gray-500">
        Your spending progress for this month
      </Text>
      <View className="mt-4">
        <AnimatedProgressBar
          percent={progressWidth}
          height={10}
          color={hexToRgba(blendHex(theme.colors[0], theme.colors[1]), 0.65)}
          className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100/80"
        />
        <View className="mt-2 flex-row justify-between">
          <Text className="text-sm text-gray-600">
            Spent: {formatCurrency(spentAmount)} ({percentSpent}%)
          </Text>
          <Text className="text-sm text-gray-600">
            {formatCurrency(totalPlanned)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
