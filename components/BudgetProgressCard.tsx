import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { formatCurrency } from "@/lib/utils";
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
  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-900">
          Overall Budget Progress
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading progress</Text>
      </Card>
    );
  }

  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const progressWidth = Math.min(percentSpent, 100);

  return (
    <Card className="gap-0 p-4">
      <Text className="text-base font-semibold text-gray-900">
        Overall Budget Progress
      </Text>
      <Text className="mt-1 text-sm text-gray-500">
        Your spending progress for this month
      </Text>
      <View className="mt-4">
        <View className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <View
            className="h-full rounded-full"
            style={{ width: `${progressWidth}%`, backgroundColor: theme.colors[0] }}
          />
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-sm text-gray-600">
            Spent: {formatCurrency(spentAmount)} ({percentSpent}%)
          </Text>
          <Text className="text-sm text-gray-600">
            {formatCurrency(0)} – {formatCurrency(totalPlanned)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
