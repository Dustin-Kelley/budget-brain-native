import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import type { CategoryWithLineItems } from "@/types";

type RemainingSpentCardsProps = {
  categories: CategoryWithLineItems[] | null;
  spentByLineItem: { line_item_id: string; spent: number }[];
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

function getSpentForLineItem(
  lineItemId: string,
  spentByLineItem: { line_item_id: string; spent: number }[]
): number {
  return spentByLineItem.find((s) => s.line_item_id === lineItemId)?.spent ?? 0;
}

export function RemainingSpentCards({
  categories,
  spentByLineItem,
  error,
}: RemainingSpentCardsProps) {
  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-900">Remaining</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading data</Text>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-900">Remaining</Text>
        <Text className="mt-2 text-sm text-gray-500">
          No categories for this month.
        </Text>
      </Card>
    );
  }

  return (
    <View className="gap-4">
      <Text className="font-semibold text-gray-900">Remaining</Text>
      {categories.map((category) => {
        const planned =
          category.line_items?.reduce(
            (sum, item) => sum + (item.planned_amount ?? 0),
            0
          ) ?? 0;
        const spent = (category.line_items ?? []).reduce(
          (sum, item) => sum + getSpentForLineItem(item.id, spentByLineItem),
          0
        );
        const remaining = planned - spent;
        const percentRemaining =
          planned > 0 ? Math.round((remaining / planned) * 100) : 0;

        return (
          <Card
            key={category.id}
            className="gap-0 overflow-hidden py-0"
          >
            <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
              <Text className="font-semibold text-gray-900" numberOfLines={1}>
                {category.name ?? "Category"}
              </Text>
              <Text
                className={
                  remaining >= 0 ? "font-medium text-green-600" : "font-medium text-red-600"
                }
              >
                {formatCurrency(remaining)} ({percentRemaining}%)
              </Text>
            </View>
            <Text className="px-4 py-1 text-xs text-gray-500">
              Remaining: {formatCurrency(remaining)} / {formatCurrency(planned)}
            </Text>
            {(category.line_items ?? []).map((item) => {
              const itemPlanned = item.planned_amount ?? 0;
              const itemSpent = getSpentForLineItem(item.id, spentByLineItem);
              const itemRemaining = itemPlanned - itemSpent;
              const itemPercent =
                itemPlanned > 0 ? Math.round((itemRemaining / itemPlanned) * 100) : 0;
              return (
                <View
                  key={item.id}
                  className="flex-row items-center justify-between border-t border-gray-50 px-4 py-2"
                >
                  <Text className="text-gray-700 pl-2" numberOfLines={1}>
                    {item.name ?? "Line item"}
                  </Text>
                  <Text
                    className={
                      itemRemaining >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatCurrency(itemRemaining)} ({itemPercent}%)
                  </Text>
                </View>
              );
            })}
          </Card>
        );
      })}
    </View>
  );
}
