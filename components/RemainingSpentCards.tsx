import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { getAppTheme } from "@/lib/themes";
import { useAddTransaction } from "@/hooks/useAddTransaction";
import { blendHex, formatCurrency } from "@/lib/utils";
import type { CategoryWithLineItems } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
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
      <View className="border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">
            Add expense — {category.name ?? "Category"}
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
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
                      selectedLineItem ? "text-gray-900" : "text-gray-400"
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
                          <Text className="font-medium text-gray-900">
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
  const barColor = blendHex(theme.colors[0], theme.colors[1]);

  const [viewMode, setViewMode] = useState<"spent" | "remaining">("spent");
  const [categoryForModal, setCategoryForModal] =
    useState<CategoryWithLineItems | null>(null);

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

  const isSpentView = viewMode === "spent";

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-gray-900">
          {isSpentView ? "Spent" : "Remaining"}
        </Text>
        <View className="flex-row overflow-hidden rounded-lg border border-gray-200">
          <Pressable
            onPress={() => setViewMode("spent")}
            className={`px-3 py-1.5 ${isSpentView ? "bg-gray-900" : "bg-white"}`}
          >
            <Text className={`text-xs font-medium ${isSpentView ? "text-white" : "text-gray-600"}`}>
              Spent
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode("remaining")}
            className={`px-3 py-1.5 ${!isSpentView ? "bg-gray-900" : "bg-white"}`}
          >
            <Text className={`text-xs font-medium ${!isSpentView ? "text-white" : "text-gray-600"}`}>
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
            <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
              <Text className="font-semibold text-gray-900" numberOfLines={1}>
                {category.name ?? "Category"}
              </Text>
              <Text
                className={
                  isSpentView
                    ? "font-medium text-gray-900"
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
                <View className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${catBarPercent}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </View>
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
                  className="border-t border-gray-50 px-4 py-2"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-700 pl-2" numberOfLines={1}>
                      {item.name ?? "Line item"}
                    </Text>
                    <Text
                      className={
                        isSpentView
                          ? "text-gray-900"
                          : itemRemaining >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {isSpentView
                        ? `${formatCurrency(itemSpent)} (${itemSpentPercent}%)`
                        : `${formatCurrency(itemRemaining)} (${itemRemainingPercent}%)`}
                    </Text>
                  </View>
                  {itemPlanned > 0 && (
                    <View className="mt-1.5 ml-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${itemBarPercent}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
            {canAddExpense && (category.line_items?.length ?? 0) > 0 && (
              <View className="border-t border-gray-50 px-4 py-2">
                <Pressable
                  onPress={() => setCategoryForModal(category)}
                  className="flex-row items-center gap-2 active:opacity-90"
                >
                  <View className="items-center justify-center rounded-full bg-[#36454F]">
                    <Ionicons name="add" size={20} color="#fff" />
                  </View>
                  <Text className="text-sm font-semibold">Add expense</Text>
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
          <View className="flex-1 justify-end bg-black/50">
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
