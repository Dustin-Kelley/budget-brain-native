import { Text } from "@/components/ui/text";
import { View } from "react-native";

type BudgetSummaryCardsProps = {
  totalPlanned: number;
  spentAmount: number;
  remaining: number;
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

export function BudgetSummaryCards({
  totalPlanned,
  spentAmount,
  remaining,
  percentSpent,
  error,
}: BudgetSummaryCardsProps) {
  if (error) {
    return (
      <View className="rounded-xl border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-gray-900">
          Budget Summary
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading summary</Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-base font-semibold text-gray-900">
        Budget Summary
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Planned
          </Text>
          <Text className="mt-1 text-xl font-bold text-gray-900">
            {formatCurrency(totalPlanned)}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            Total budget for this month
          </Text>
        </View>
        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Spent
          </Text>
          <Text className="mt-1 text-xl font-bold text-gray-900">
            {formatCurrency(spentAmount)}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            {percentSpent}% of budget used
          </Text>
        </View>
        <View className="flex-1 rounded-xl border border-gray-200 bg-white p-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Remaining
          </Text>
          <Text className="mt-1 text-xl font-bold text-gray-900">
            {formatCurrency(remaining)}
          </Text>
          <Text className="mt-0.5 text-xs text-gray-500">
            {100 - percentSpent}% left
          </Text>
        </View>
      </View>
    </View>
  );
}
