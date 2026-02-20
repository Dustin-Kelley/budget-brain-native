import type { CategorySpent } from "@/lib/queries/getSpentByCategory";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

type CategorySpendingListProps = {
  categorySpent: CategorySpent[];
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

export function CategorySpendingList({
  categorySpent,
  error,
}: CategorySpendingListProps) {
  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-900">
          Spending by Category
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading categories</Text>
      </Card>
    );
  }

  if (categorySpent.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-900">
          Spending by Category
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          No spending recorded for this month.
        </Text>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <View className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        <Text className="text-base font-semibold text-gray-900">
          Spending by Category
        </Text>
      </View>
      {categorySpent.map((item) => (
        <View
          key={item.category_id}
          className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0"
        >
          <Text className="text-base text-gray-900" numberOfLines={1}>
            {item.category_name ?? "Uncategorized"}
          </Text>
          <Text className="text-base font-medium text-gray-900">
            {formatCurrency(item.spent)}
          </Text>
        </View>
      ))}
    </Card>
  );
}
