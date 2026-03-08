import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { CATEGORY_COLORS } from "@/lib/constants";
import type { CategorySpent } from "@/lib/queries/getSpentByCategory";
import { formatCurrency } from "@/lib/utils";
import type { CategoryWithLineItems } from "@/types";
import { View } from "react-native";

export type CategorySpendingListProps = {
  categorySpent: CategorySpent[];
  categories?: CategoryWithLineItems[] | null;
  error?: string | null;
};

export function CategorySpendingList({
  categorySpent,
  categories,
  error,
}: CategorySpendingListProps) {
  const plannedByCategory = new Map<string, number>();
  const colorByCategory = new Map<string, string | null>();
  if (categories) {
    for (const cat of categories) {
      const planned = (cat.line_items ?? []).reduce(
        (sum, li) => sum + (li.planned_amount ?? 0),
        0,
      );
      plannedByCategory.set(cat.id, planned);
      colorByCategory.set(cat.id, cat.color ?? null);
    }
  }
  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-800">
          Spending by Category
        </Text>
        <Text className="mt-2 text-sm text-red-600">Error loading categories</Text>
      </Card>
    );
  }

  if (categorySpent.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="text-base font-semibold text-gray-800">
          Spending by Category
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          No spending recorded for this month.
        </Text>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-2">
      <View className="border-b border-gray-100 px-4 pb-2.5">
        <Text className="text-base font-semibold text-gray-800">
          Spending by Category
        </Text>
      </View>
      {categorySpent.map((item, i) => {
        const planned = plannedByCategory.get(item.category_id) ?? 0;
        const percent = planned > 0 ? Math.min(Math.round((item.spent / planned) * 100), 100) : 0;
        const barColor = item.color ?? colorByCategory.get(item.category_id) ?? CATEGORY_COLORS[i % CATEGORY_COLORS.length];
        return (
          <View
            key={item.category_id}
            className="border-b border-gray-100 px-4 py-3.5 last:border-b-0"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-base text-gray-800" numberOfLines={1}>
                {item.category_name ?? "Uncategorized"}
              </Text>
              <Text className="text-base font-medium text-gray-800">
                {formatCurrency(item.spent)}{planned > 0 ? ` / ${formatCurrency(planned)}` : ""}
              </Text>
            </View>
            {planned > 0 && (
              <AnimatedProgressBar
                percent={percent}
                height={6}
                color={barColor}
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
              />
            )}
          </View>
        );
      })}
    </Card>
  );
}
