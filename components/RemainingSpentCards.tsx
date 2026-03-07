import { AnimatedProgressBar } from "@/components/AnimatedProgressBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { useAddTransaction } from "@/hooks/useAddTransaction";
import { blendHex, formatCurrency, hexToRgba } from "@/lib/utils";
import type { CategoryWithLineItems } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  type LayoutChangeEvent,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

type QuickAddExpenseModalProps = {
  category: CategoryWithLineItems;
  householdId: string;
  userId: string;
  monthKey: string;
  onClose: () => void;
  onSuccess: () => void;
};

function QuickAddExpenseModal({
  category,
  householdId,
  userId,
  monthKey,
  onClose,
  onSuccess,
}: QuickAddExpenseModalProps) {
  const insets = useSafeAreaInsets();
  const addTransaction = useAddTransaction();
  const lineItems = category.line_items ?? [];
  const firstLineItemId = lineItems[0]?.id ?? null;

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [lineItemId, setLineItemId] = useState<string | null>(firstLineItemId);
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [showLineItemPicker, setShowLineItemPicker] = useState(false);

  const selectedLineItem = lineItems.find((item) => item.id === lineItemId);

  const handleSubmit = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid amount", "Please enter a positive number.");
      return;
    }
    if (!lineItemId) {
      Alert.alert("Budget item required", "Please select a budget item.");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Date required", "Please enter the date.");
      return;
    }

    try {
      await addTransaction.mutateAsync({
        amount: amountNum,
        description: description.trim() || undefined,
        lineItemId,
        dateOfTransaction: date.trim(),
        householdId,
        userId,
        monthKey,
      });
      onSuccess();
      onClose();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <>
      <View className="items-center mt-2 mb-1">
        <View className="h-[5px] w-9 rounded-full bg-gray-300" />
      </View>
      <View className="border-b border-gray-100 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-800">
            Add expense — {category.name ?? "Category"}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200"
          >
            <Ionicons name="close" size={16} color="#6B7280" />
          </Pressable>
        </View>
        <Text className="mt-1 text-sm text-gray-500">
          Enter the transaction for this category.
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
          <View className="gap-4">
            <View className="gap-2">
              <Label>Amount *</Label>
              <Input
                className="h-auto rounded-lg px-4 py-3"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                editable={!addTransaction.isPending}
              />
            </View>

            <View className="gap-2">
              <Label>Description</Label>
              <Input
                className="h-auto rounded-lg px-4 py-3"
                placeholder="Optional"
                value={description}
                onChangeText={setDescription}
                editable={!addTransaction.isPending}
              />
            </View>

            {lineItems.length > 1 && (
              <View className="gap-2">
                <Label>Budget item *</Label>
                <Pressable
                  onPress={() => setShowLineItemPicker((prev) => !prev)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <Text
                    className={
                      selectedLineItem ? "text-gray-800" : "text-gray-400"
                    }
                  >
                    {selectedLineItem?.name ?? "Select budget item"}
                  </Text>
                </Pressable>
                {showLineItemPicker && (
                  <View className="mt-2 max-h-40 rounded-lg border border-gray-200 bg-gray-50">
                    <ScrollView className="max-h-40">
                      {lineItems.map((item) => (
                        <Pressable
                          key={item.id}
                          onPress={() => {
                            setLineItemId(item.id);
                            setShowLineItemPicker(false);
                          }}
                          className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                        >
                          <Text className="font-medium text-gray-800">
                            {item.name ?? "Item"}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}

            <View className="gap-2">
              <Label>Date *</Label>
              <Input
                className="h-auto rounded-lg px-4 py-3"
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={setDate}
                editable={!addTransaction.isPending}
              />
            </View>
          </View>
      </ScrollView>

      <View
        className="border-t border-gray-200 px-4 pt-4"
        style={{ paddingBottom: 16 + insets.bottom }}
      >
        <Button onPress={handleSubmit} disabled={addTransaction.isPending}>
          {addTransaction.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text>Save expense</Text>
          )}
        </Button>
      </View>
    </>
  );
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
  const barColor = hexToRgba(accentHex, 0.65);
  const accentColor = accentHex;

  const [viewMode, setViewMode] = useState<"spent" | "remaining">("spent");
  const [categoryForModal, setCategoryForModal] =
    useState<CategoryWithLineItems | null>(null);

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
  }, [activeToggleIndex, tabOffsets, tabWidths]);

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

  const handleQuickAddClose = () => setCategoryForModal(null);
  const handleQuickAddSuccess = () => {
    onSuccess?.();
    setCategoryForModal(null);
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
          {isSpentView ? "Spent" : "Remaining"}
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
        const percentSpent =
          planned > 0 ? Math.round((spent / planned) * 100) : 0;
        const percentRemaining =
          planned > 0 ? Math.round((remaining / planned) * 100) : 0;
        const catBarPercent = isSpentView
          ? Math.min(percentSpent, 100)
          : Math.min(Math.max(percentRemaining, 0), 100);

        return (
          <Card
            key={category.id}
            className="gap-0 overflow-hidden py-0"
          >
            <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3.5">
              <Text className="font-semibold text-gray-800" numberOfLines={1}>
                {category.name ?? "Category"}
              </Text>
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
              <View className="px-4 pt-2">
                <AnimatedProgressBar
                  percent={catBarPercent}
                  height={8}
                  color={barColor}
                  className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
                />
              </View>
            )}
            <Text className="px-4 py-1 text-xs text-gray-500">
              {isSpentView
                ? `Spent: ${formatCurrency(spent)} / ${formatCurrency(planned)}`
                : `Remaining: ${formatCurrency(remaining)} / ${formatCurrency(planned)}`}
            </Text>
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
                  className="border-t border-gray-50 px-4 py-2.5"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-700 pl-3" numberOfLines={1}>
                      {item.name ?? "Line item"}
                    </Text>
                    <Text
                      className={
                        isSpentView
                          ? "text-gray-800"
                          : itemRemaining >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {isSpentView
                        ? `${formatCurrency(itemSpent)} (${itemSpentPercent}%)`
                        : `${formatCurrency(itemRemaining)} (${itemRemainingPercent}%)`}
                    </Text>
                  </View>
                  {itemPlanned > 0 && (
                    <AnimatedProgressBar
                      percent={itemBarPercent}
                      height={6}
                      color={barColor}
                      className="mt-1.5 ml-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                    />
                  )}
                </View>
              );
            })}
            {canAddExpense && (category.line_items?.length ?? 0) > 0 && (
              <View className="border-t border-gray-50 px-4 py-2.5">
                <Pressable
                  onPress={() => setCategoryForModal(category)}
                  className="flex-row items-center gap-2 active:opacity-90"
                >
                  <View
                    className="items-center justify-center rounded-full"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <Ionicons name="add" size={20} color={accentColor} />
                  </View>
                  <Text className="text-sm font-medium" style={{ color: accentColor }}>Add expense</Text>
                </Pressable>
              </View>
            )}
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
                key={categoryForModal.id}
                category={categoryForModal}
                householdId={householdId}
                userId={userId}
                monthKey={monthKey}
                onClose={handleQuickAddClose}
                onSuccess={handleQuickAddSuccess}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
