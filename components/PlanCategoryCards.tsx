import { AddCategoryForm } from "@/components/AddCategoryForm";
import { AddLineItemForm } from "@/components/AddLineItemForm";
import { EditLineItemForm } from "@/components/EditLineItemForm";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { CategoryWithLineItems, LineItem } from "@/types";
import { useState } from "react";
import { Pressable, View } from "react-native";

type PlanCategoryCardsProps = {
  categories: CategoryWithLineItems[] | null;
  totalIncome: number;
  error?: string | null;
  householdId?: string;
  userId?: string;
  monthKey?: string;
  onRefetch?: () => void;
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
  householdId,
  userId,
  monthKey,
  onRefetch,
}: PlanCategoryCardsProps) {
  const [editingLineItem, setEditingLineItem] = useState<{
    item: LineItem;
    categoryId: string;
  } | null>(null);

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-900">Planned</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading categories</Text>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-gray-900">Planned</Text>
          {householdId && monthKey && onRefetch && (
            <AddCategoryForm
              householdId={householdId}
              monthKey={monthKey}
              onSuccess={onRefetch}
            />
          )}
        </View>
        <Card className="gap-0 p-4">
          <Text className="text-sm text-gray-500">
            No categories for this month. Add income above, then add a category.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-gray-900">Planned</Text>
        {householdId && monthKey && onRefetch && (
          <AddCategoryForm
            householdId={householdId}
            monthKey={monthKey}
            onSuccess={onRefetch}
          />
        )}
      </View>
      {categories.map((category) => {
        const categoryPlanned =
          category.line_items?.reduce(
            (sum, item) => sum + (item.planned_amount ?? 0),
            0
          ) ?? 0;
        const percent =
          totalIncome > 0 ? Math.round((categoryPlanned / totalIncome) * 100) : 0;

        return (
          <Card
            key={category.id}
            className="gap-0 overflow-hidden py-0"
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
              <Pressable
                key={item.id}
                onPress={() =>
                  userId &&
                  monthKey &&
                  onRefetch &&
                  setEditingLineItem({ item, categoryId: category.id })
                }
                className="flex-row items-center justify-between border-b border-gray-50 px-4 py-2 last:border-b-0 active:bg-gray-50"
              >
                <Text className="text-gray-700 pl-2" numberOfLines={1}>
                  {item.name ?? "Line item"}
                </Text>
                <Text className="font-medium text-gray-900">
                  {formatCurrency(item.planned_amount ?? 0)}
                </Text>
              </Pressable>
            ))}
            {userId && monthKey && onRefetch && (
              <View className="border-t border-gray-100 px-4 py-2">
                <AddLineItemForm
                  categoryId={category.id}
                  categoryName={category.name ?? "Category"}
                  monthKey={monthKey}
                  userId={userId}
                  onSuccess={onRefetch}
                />
              </View>
            )}
          </Card>
        );
      })}
      {editingLineItem && onRefetch && (
        <EditLineItemForm
          lineItem={editingLineItem.item}
          categoryId={editingLineItem.categoryId}
          visible
          onClose={() => setEditingLineItem(null)}
          onSuccess={() => {
            onRefetch();
            setEditingLineItem(null);
          }}
        />
      )}
    </View>
  );
}
