import { AddCategoryForm } from "@/components/AddCategoryForm";
import { AddLineItemForm } from "@/components/AddLineItemForm";
import { EditCategoryForm } from "@/components/EditCategoryForm";
import { EditLineItemForm } from "@/components/EditLineItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { Category, CategoryWithLineItems, LineItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { IncomeCard } from "./IncomeCard";
import { Separator } from "./ui/separator";

type PlanCategoryCardsProps = {
  categories: CategoryWithLineItems[] | null;
  totalIncome: number;
  totalPlanned: number;
  income: { id: string; name: string | null; amount: number }[];
  monthLabel: string;
  error?: string | null;
  householdId?: string;
  userId?: string;
  monthKey?: string;
  onRefetch?: () => void;
};

export function PlanCategoryCards({
  categories,
  totalIncome,
  totalPlanned,
  income,
  monthLabel,
  error,
  householdId,
  userId,
  monthKey,
  onRefetch,
}: PlanCategoryCardsProps) {
  const deleteCategoryMutation = useDeleteCategory();
  const [editingLineItem, setEditingLineItem] = useState<{
    item: LineItem;
    categoryId: string;
  } | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCategoryPress = (category: Category) => {
    setEditingCategory(category);
  };

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Planned</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading categories</Text>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-gray-800">Planned</Text>
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
    <View className="gap-8">
      <IncomeCard
        income={income}
        totalIncome={totalIncome}
        totalPlanned={totalPlanned}
        monthLabel={monthLabel}
        error={error}
        householdId={householdId}
        userId={userId}
        monthKey={monthKey}
        onRefetch={onRefetch}
      />
      {categories.map((category, catIndex) => {
        const categoryPlanned =
          category.line_items?.reduce(
            (sum, item) => sum + (item.planned_amount ?? 0),
            0
          ) ?? 0;
        const percent =
          totalIncome > 0 ? Math.round((categoryPlanned / totalIncome) * 100) : 0;

        return (
          <Card key={category.id} className="gap-0">
            <CardHeader className="border-b border-gray-100">
              <Pressable
                onPress={() => handleCategoryPress(category)}
                className="flex-row items-center justify-between py-4 active:bg-gray-50"
              >
                <View className="flex-row items-center gap-2">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color ?? CATEGORY_COLORS[catIndex % CATEGORY_COLORS.length] }}
                  />
                  <CardTitle className="text-lg text-gray-800" numberOfLines={1}>
                    {category.name ?? "Category"}
                  </CardTitle>
                  <Ionicons name="pencil" size={12} color="#9ca3af" />
                </View>
                <Text className="text-gray-600">
                  {formatCurrency(categoryPlanned)} ({percent}%)
                </Text>
              </Pressable>
            </CardHeader>
            <CardContent className="px-4 py-0">
              {(category.line_items ?? []).map((item) => (
                <>
                  <Pressable
                    key={item.id}
                    onPress={() =>
                      userId &&
                      monthKey &&
                      onRefetch &&
                      setEditingLineItem({ item, categoryId: category.id })
                    }
                    className="flex-row items-center justify-between border-b border-gray-50 py-2.5 last:border-b-0 active:bg-gray-50"
                  >
                    <Text className="pl-3 text-lg text-gray-700" numberOfLines={1}>
                      {item.name ?? "Line item"}
                    </Text>
                    <Text className="text-md font-medium text-gray-800">
                      {formatCurrency(item.planned_amount ?? 0)}
                    </Text>
                  </Pressable>
                  <Separator />
                </>
              ))}
              {userId && monthKey && onRefetch && (
                <View className="border-t border-gray-100 py-4">
                  <AddLineItemForm
                    categoryId={category.id}
                    categoryName={category.name ?? "Category"}
                    monthKey={monthKey}
                    userId={userId}
                    onSuccess={onRefetch}
                  />
                </View>
              )}
            </CardContent>
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
      {editingCategory && onRefetch && (
        <EditCategoryForm
          category={editingCategory}
          visible
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            onRefetch();
            setEditingCategory(null);
          }}
        />
      )}
      {householdId && monthKey && onRefetch && (
        <AddCategoryForm
          householdId={householdId}
          monthKey={monthKey}
          onSuccess={onRefetch}
        />
      )}
    </View>
  );
}
