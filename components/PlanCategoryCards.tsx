import { Text } from "@/components/ui/text";
import { View } from "react-native";
import type { CategoryWithLineItems } from "@/types";

type PlanCategoryCardsProps = {
  categories: CategoryWithLineItems[] | null;
  totalIncome: number;
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

export function PlanCategoryCards({
  categories,
  totalIncome,
  error,
}: PlanCategoryCardsProps) {
  if (error) {
    return (
      <View className="rounded-xl border border-gray-200 bg-white p-4">
        <Text className="font-semibold text-gray-900">Planned</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading categories</Text>
      </View>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View className="rounded-xl border border-gray-200 bg-white p-4">
        <Text className="font-semibold text-gray-900">Planned</Text>
        <Text className="mt-2 text-sm text-gray-500">
          No categories for this month. Add income and categories on the web app.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Text className="font-semibold text-gray-900">Planned</Text>
      {categories.map((category) => {
        const categoryPlanned =
          category.line_items?.reduce(
            (sum, item) => sum + (item.planned_amount ?? 0),
            0
          ) ?? 0;
        const percent =
          totalIncome > 0 ? Math.round((categoryPlanned / totalIncome) * 100) : 0;

        return (
          <View
            key={category.id}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
              <Text className="font-semibold text-gray-900" numberOfLines={1}>
                {category.name ?? "Category"}
              </Text>
              <Text className="text-gray-600">
                {formatCurrency(categoryPlanned)} ({percent}%)
              </Text>
            </View>
            {(category.line_items ?? []).map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between border-b border-gray-50 px-4 py-2 last:border-b-0"
              >
                <Text className="text-gray-700 pl-2" numberOfLines={1}>
                  {item.name ?? "Line item"}
                </Text>
                <Text className="font-medium text-gray-900">
                  {formatCurrency(item.planned_amount ?? 0)}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
