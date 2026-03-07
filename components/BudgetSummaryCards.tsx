import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { blendHex, formatCurrency, hexToRgba } from "@/lib/utils";
import { View } from "react-native";

type BudgetSummaryCardsProps = {
  totalPlanned: number;
  spentAmount: number;
  remaining: number;
  percentSpent: number;
  error?: string | null;
};

export function BudgetSummaryCards({
  totalPlanned,
  spentAmount,
  remaining,
  percentSpent,
  error,
}: BudgetSummaryCardsProps) {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const barColor = hexToRgba(blendHex(theme.colors[0], theme.colors[1]), 0.65);
  const spentWidth = Math.min(percentSpent, 100);
  const remainingWidth = Math.min(100 - percentSpent, 100);

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-800">
          Budget Summary
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading summary</Text>
      </Card>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-gray-800">
        Budget Summary
      </Text>
      <View className="flex-row gap-3">
        <Card className="flex-1 gap-0 p-5">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Planned
          </Text>
          <Text className="mt-1 text-xl font-bold text-gray-800">
            {formatCurrency(totalPlanned)}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            Total budget for this month
          </Text>
        </Card>
        <Card className="flex-1 gap-0 p-5">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Spent
          </Text>
          <Text className="mt-1 text-xl font-bold text-gray-800">
            {formatCurrency(spentAmount)}
          </Text>
          <AnimatedProgressBar
            percent={spentWidth}
            height={6}
            color={barColor}
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
          />
          <Text className="mt-1 text-xs text-gray-500">
            {percentSpent}% of budget used
          </Text>
        </Card>
        <Card className="flex-1 gap-0 p-5">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Remaining
          </Text>
          <Text className="mt-1 text-xl font-bold text-gray-800">
            {formatCurrency(remaining)}
          </Text>
          <AnimatedProgressBar
            percent={Math.max(remainingWidth, 0)}
            height={6}
            color={barColor}
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
          />
          <Text className="mt-1 text-xs text-gray-500">
            {100 - percentSpent}% left
          </Text>
        </Card>
      </View>
    </View>
  );
}
