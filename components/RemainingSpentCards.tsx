import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { QuickAddExpenseModal } from "@/components/QuickAddExpenseModal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { CATEGORY_COLORS } from "@/lib/constants";
import { getAppTheme } from "@/lib/themes";
import { blendHex, formatCurrency } from "@/lib/utils";
import type { CategoryWithLineItems } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  type LayoutChangeEvent,
  Modal,
  Pressable,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
type RemainingSpentCardsProps = {
  categories: CategoryWithLineItems[] | null;
  spentByLineItem: { line_item_id: string; spent: number }[];
  error?: string | null;
  householdId?: string;
  userId?: string;
  monthKey?: string;
  onSuccess?: () => void;
};

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
  householdId,
  userId,
  monthKey,
  onSuccess,
}: RemainingSpentCardsProps) {
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const accentHex = blendHex(theme.colors[0], theme.colors[1]);
  const accentColor = accentHex;

  const [viewMode, setViewMode] = useState<"spent" | "remaining">("spent");
  const [categoryForModal, setCategoryForModal] =
    useState<CategoryWithLineItems | null>(null);
  const [preselectedLineItemId, setPreselectedLineItemId] = useState<string | null>(null);

  const [tabWidths, setTabWidths] = useState<number[]>([0, 0]);
  const [tabOffsets, setTabOffsets] = useState<number[]>([0, 0]);
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const handleTabLayout = useCallback(
    (index: number) => (e: LayoutChangeEvent) => {
      const { x, width } = e.nativeEvent.layout;
      setTabOffsets((prev) => {
        const next = [...prev];
        next[index] = x;
        return next;
      });
      setTabWidths((prev) => {
        const next = [...prev];
        next[index] = width;
        return next;
      });
    },
    []
  );

  const activeToggleIndex = viewMode === "spent" ? 0 : 1;

  useEffect(() => {
    if (tabWidths[activeToggleIndex] > 0) {
      indicatorX.value = withTiming(tabOffsets[activeToggleIndex], { duration: 250 });
      indicatorW.value = withTiming(tabWidths[activeToggleIndex], { duration: 250 });
    }
  }, [activeToggleIndex, indicatorX, indicatorW, tabOffsets, tabWidths]);

  const indicatorStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: indicatorX.value,
    width: indicatorW.value,
    top: 2,
    bottom: 2,
    borderRadius: 6,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  }));

  const canAddExpense =
    householdId && userId && monthKey && onSuccess;

  const handleQuickAddClose = () => {
    setCategoryForModal(null);
    setPreselectedLineItemId(null);
  };
  const handleQuickAddSuccess = () => {
    onSuccess?.();
    setCategoryForModal(null);
    setPreselectedLineItemId(null);
  };

  if (error) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Remaining</Text>
        <Text className="mt-2 text-sm text-red-600">Error loading data</Text>
      </Card>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Card className="gap-0 p-4">
        <Text className="font-semibold text-gray-800">Remaining</Text>
        <Text className="mt-2 text-sm text-gray-500">
          No categories for this month.
        </Text>
      </Card>
    );
  }

  const isSpentView = viewMode === "spent";

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-gray-800">
          {isSpentView ? "Spent so far" : "Left to spend"}
        </Text>
        <View className="flex-row rounded-lg bg-gray-100 p-0.5">
          <Animated.View style={indicatorStyle} />
          <Pressable
            onLayout={handleTabLayout(0)}
            onPress={() => setViewMode("spent")}
            className="rounded-md px-3 py-1.5"
          >
            <Text className={`text-xs font-semibold ${isSpentView ? "text-gray-800" : "text-gray-500"}`}>
              Spent
            </Text>
          </Pressable>
          <Pressable
            onLayout={handleTabLayout(1)}
            onPress={() => setViewMode("remaining")}
            className="rounded-md px-3 py-1.5"
          >
            <Text className={`text-xs font-semibold ${!isSpentView ? "text-gray-800" : "text-gray-500"}`}>
              Remaining
            </Text>
          </Pressable>
        </View>
      </View>
      {categories.map((category, catIndex) => {
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
        const percentSpent =
          planned > 0 ? Math.round((spent / planned) * 100) : 0;
        const percentRemaining =
          planned > 0 ? Math.round((remaining / planned) * 100) : 0;
        const catBarPercent = isSpentView
          ? Math.min(percentSpent, 100)
          : Math.min(Math.max(percentRemaining, 0), 100);
        const barColor = category.color ?? CATEGORY_COLORS[catIndex % CATEGORY_COLORS.length];

        return (
          <Card key={category.id} className="gap-0 py-3">
            <CardHeader className="border-b px-6 py-2 border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: barColor }}
                  />
                  <Text className="font-semibold text-gray-800" numberOfLines={1}>
                    {category.name ?? "Category"}
                  </Text>
                </View>
                <Text
                  className={
                    isSpentView
                      ? "font-medium text-gray-800"
                      : remaining >= 0 ? "font-medium text-green-600" : "font-medium text-red-600"
                  }
                >
                  {isSpentView
                    ? `${formatCurrency(spent)} (${percentSpent}%)`
                    : `${formatCurrency(remaining)} (${percentRemaining}%)`}
                </Text>
              </View>
              {planned > 0 && (
                <AnimatedProgressBar
                  percent={catBarPercent}
                  height={8}
                  color={barColor}
                  className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100"
                />
              )}
              <Text className="text-xs text-gray-500">
                {isSpentView
                  ? `Spent: ${formatCurrency(spent)} / ${formatCurrency(planned)}`
                  : `Remaining: ${formatCurrency(remaining)} / ${formatCurrency(planned)}`}
              </Text>
            </CardHeader>
            <CardContent className="gap-2">
              {(category.line_items ?? []).map((item) => {
                const itemPlanned = item.planned_amount ?? 0;
                const itemSpent = getSpentForLineItem(item.id, spentByLineItem);
                const itemRemaining = itemPlanned - itemSpent;
                const itemSpentPercent =
                  itemPlanned > 0 ? Math.min(Math.round((itemSpent / itemPlanned) * 100), 100) : 0;
                const itemRemainingPercent =
                  itemPlanned > 0 ? Math.round((itemRemaining / itemPlanned) * 100) : 0;
                const itemBarPercent = isSpentView
                  ? itemSpentPercent
                  : Math.min(Math.max(itemRemainingPercent, 0), 100);
                return (
                  <View
                    key={item.id}
                    className="border-t border-gray-50 py-3 gap-4"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-gray-700" numberOfLines={1}>
                          {item.name ?? "Line item"}
                        </Text>
                        <Text
                          className={
                            isSpentView
                              ? "text-sm text-gray-500"
                              : itemRemaining >= 0 ? "text-sm text-green-600" : "text-sm text-red-600"
                          }
                        >
                          {isSpentView
                            ? `${formatCurrency(itemSpent)} (${itemSpentPercent}%)`
                            : `${formatCurrency(itemRemaining)} (${itemRemainingPercent}%)`}
                        </Text>
                      </View>
                      {canAddExpense && (
                        <Pressable
                          onPress={() => {
                            setPreselectedLineItemId(item.id);
                            setCategoryForModal(category);
                          }}
                          hitSlop={6}
                          className="items-center justify-center p-1 rounded-full active:opacity-70"
                          style={{ backgroundColor: accentColor + "20" }}
                        >
                          <Ionicons name="add" size={20} color={accentColor} />
                        </Pressable>
                      )}
                    </View>
                    {itemPlanned > 0 && (
                      <AnimatedProgressBar
                        percent={itemBarPercent}
                        height={6}
                        color={barColor}
                        className=" h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                      />
                    )}
                  </View>
                );
              })}
            </CardContent>
          </Card>
        );
      })}

      {categoryForModal && householdId && userId && monthKey && (
        <Modal
          visible
          animationType="slide"
          transparent
          onRequestClose={handleQuickAddClose}
        >
          <View className="flex-1 justify-end bg-black/40">
            <Pressable
              className="flex-1"
              onPress={handleQuickAddClose}
            />
            <View className="h-[90%] rounded-t-2xl bg-white shadow-none">
              <QuickAddExpenseModal
                key={`${categoryForModal.id}-${preselectedLineItemId}`}
                category={categoryForModal}
                householdId={householdId}
                userId={userId}
                monthKey={monthKey}
                onClose={handleQuickAddClose}
                onSuccess={handleQuickAddSuccess}
                preselectedLineItemId={preselectedLineItemId}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
