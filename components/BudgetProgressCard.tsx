import { Text } from "@/components/ui/text";
import { View } from "react-native";

type BudgetProgressCardProps = {
  totalPlanned: number;
  spentAmount: number;
  percentSpent: number;
  error?: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BudgetProgressCard({
  totalPlanned,
  spentAmount,
  percentSpent,
  error,
}: BudgetProgressCardProps) {
  if (error) {
    return (
      <View className="rounded-xl border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-gray-900">
          Overall Budget Progress
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading progress</Text>
      </View>
    );
  }

  const progressWidth = Math.min(percentSpent, 100);

  return (
    <View className="rounded-xl border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-gray-900">
        Overall Budget Progress
      </Text>
      <Text className="mt-1 text-sm text-gray-500">
        Your spending progress for this month
      </Text>
      <View className="mt-4">
        <View className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <View
            className="h-full rounded-full bg-gray-800"
            style={{ width: `${progressWidth}%` }}
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
    </View>
  );
}
