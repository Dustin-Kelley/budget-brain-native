import { BackButton } from "@/components/BackButton";
import { CalendarPicker } from "@/components/CalendarPicker";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { useAddTransaction } from "@/hooks/useAddTransaction";
import { getAppTheme } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { addExpenseSchema, type AddExpenseFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CategoryWithLineItems, LineItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
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

type AddExpenseFormProps = {
  categories: CategoryWithLineItems[] | null;
  householdId: string;
  userId: string;
  monthKey: string;
  onSuccess: () => void;
};

function flattenLineItems(
  categories: CategoryWithLineItems[] | null
): { item: LineItem; categoryName: string }[] {
  if (!categories) return [];
  return categories.flatMap((cat) =>
    (cat.line_items ?? []).map((item) => ({
      item,
      categoryName: cat.name ?? "Category",
    }))
  );
}

export function AddExpenseForm({
  categories,
  householdId,
  userId,
  monthKey,
  onSuccess,
}: AddExpenseFormProps) {
  const insets = useSafeAreaInsets();
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const addTransaction = useAddTransaction();
  const [visible, setVisible] = useState(false);
  const [showLineItemPicker, setShowLineItemPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const lineItems = flattenLineItems(categories);

  const form = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: "",
      description: "",
      lineItemId: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    },
    mode: "onBlur",
  });

  const lineItemId = form.watch("lineItemId");
  const selectedLineItem = lineItems.find(({ item }) => item.id === lineItemId);

  const handleClose = () => {
    setVisible(false);
    setShowLineItemPicker(false);
    setShowDatePicker(false);
    form.reset({
      amount: "",
      description: "",
      lineItemId: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
  };

  const onSubmit = async (data: AddExpenseFormData) => {
    try {
      await addTransaction.mutateAsync({
        amount: parseFloat(data.amount),
        description: data.description?.trim() || undefined,
        note: data.note?.trim() || undefined,
        lineItemId: data.lineItemId,
        dateOfTransaction: data.date,
        householdId,
        userId,
        monthKey,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  };

  const tabBarHeight = 49;
  const fabGapAboveTabs = 12;
  const fabBottom = insets.bottom + tabBarHeight + fabGapAboveTabs;

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="absolute right-4 h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{ bottom: fabBottom, backgroundColor: blendHex(theme.colors[0], theme.colors[1]) }}
      >
        <Ionicons name="add" size={28} color="white" />
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-[90%] flex flex-col rounded-t-2xl bg-white shadow-none">
            {showDatePicker ? (
              <>
                <View className="shrink-0 border-b border-gray-200 px-4 py-3">
                  <View className="flex-row items-center justify-between">
                    <BackButton onPress={() => setShowDatePicker(false)} />
                    <Pressable
                      onPress={handleClose}
                      hitSlop={8}
                      className="h-12 w-12 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                    >
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </Pressable>
                  </View>
                  <Text className="mt-2 text-lg font-semibold text-gray-900">
                    Select Date
                  </Text>
                </View>
                <ScrollView className="flex-1 px-4 py-3">
                  <Controller
                    control={form.control}
                    name="date"
                    render={({ field: { value, onChange } }) => (
                      <CalendarPicker
                        value={value}
                        onSelect={(date) => {
                          onChange(date);
                          setShowDatePicker(false);
                        }}
                      />
                    )}
                  />
                </ScrollView>
              </>
            ) : showLineItemPicker ? (
              <>
                <View className="shrink-0 border-b border-gray-200 px-4 py-3">
                  <View className="flex-row items-center justify-between">
                    <BackButton onPress={() => setShowLineItemPicker(false)} />
                    <Pressable onPress={handleClose} hitSlop={8} className="h-12 w-12 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </Pressable>
                  </View>
                  <Text className="mt-2 text-lg font-semibold text-gray-900">
                    Select Budget Item
                  </Text>
                </View>

                <ScrollView className="flex-1 px-4 py-3" contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
                  {!categories || categories.length === 0 ? (
                    <Text className="p-4 text-center text-sm text-gray-500">
                      No budget items yet. Add categories and line items in your budget plan.
                    </Text>
                  ) : (
                    categories.map((category) => (
                      <View key={category.id} className="mb-4">
                        <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          {category.name ?? "Category"}
                        </Text>
                        {(category.line_items ?? []).length === 0 ? (
                          <Text className="px-1 text-sm text-gray-400">
                            No items in this category
                          </Text>
                        ) : (
                          <View className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                            {(category.line_items ?? []).map((item, index) => (
                              <Pressable
                                key={item.id}
                                onPress={() => {
                                  form.setValue("lineItemId", item.id, { shouldValidate: true });
                                  setShowLineItemPicker(false);
                                }}
                                className={`flex-row items-center justify-between px-4 py-3 active:bg-gray-100 ${index > 0 ? "border-t border-gray-200" : ""}`}
                              >
                                <Text className="font-medium text-gray-900">
                                  {item.name ?? "Item"}
                                </Text>
                                {lineItemId === item.id && (
                                  <Ionicons name="checkmark" size={18} color={theme.colors[0]} />
                                )}
                              </Pressable>
                            ))}
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </ScrollView>
              </>
            ) : (
              <>
                <View className="shrink-0 border-b border-gray-200 px-4 py-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-gray-900">
                      Add New Expense
                    </Text>
                    <Pressable onPress={handleClose} hitSlop={8} className="h-12 w-12 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                      <Ionicons name="close" size={20} color="#6B7280" />
                    </Pressable>
                  </View>
                  <Text className="mt-1 text-sm text-gray-500">
                    Add a new expense to your budget.
                  </Text>
                </View>

                <ScrollView className="flex-1 px-4 py-4">
                  <View className="gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      label="Amount *"
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      editable={!form.formState.isSubmitting}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      label="Description"
                      placeholder="Optional"
                      editable={!form.formState.isSubmitting}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      label="Note"
                      placeholder="Optional"
                      editable={!form.formState.isSubmitting}
                    />

                    <Controller
                      control={form.control}
                      name="lineItemId"
                      render={({ fieldState: { error } }) => (
                        <View className="gap-2">
                          <Label>Budget Item *</Label>
                          <Pressable
                            onPress={() => setShowLineItemPicker(true)}
                            className={`flex-row items-center justify-between rounded-lg border bg-gray-50 px-4 py-3 ${error ? "border-destructive" : "border-gray-200"}`}
                          >
                            <Text
                              className={
                                selectedLineItem
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }
                            >
                              {selectedLineItem
                                ? `${selectedLineItem.categoryName} → ${selectedLineItem.item.name ?? "Item"}`
                                : "Select budget item"}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                          </Pressable>
                          {error?.message && (
                            <Text className="text-sm text-destructive">{error.message}</Text>
                          )}
                        </View>
                      )}
                    />

                    <Controller
                      control={form.control}
                      name="date"
                      render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <View className="gap-2">
                          <Label>Date *</Label>
                          <Pressable
                            onPress={() => setShowDatePicker(true)}
                            disabled={form.formState.isSubmitting}
                            className={`flex-row items-center justify-between rounded-lg border bg-gray-50 px-4 py-3 ${error ? "border-destructive" : "border-gray-200"}`}
                          >
                            <Text className={value ? "text-gray-900" : "text-gray-400"}>
                              {value
                                ? new Date(value + "T12:00:00").toLocaleDateString(
                                    "en-US",
                                    { weekday: "short", month: "short", day: "numeric", year: "numeric" }
                                  )
                                : "Select date"}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                          </Pressable>
                          {error?.message && (
                            <Text className="text-sm text-destructive">{error.message}</Text>
                          )}
                        </View>
                      )}
                    />
                  </View>
                </ScrollView>

                <View
                  className="shrink-0 border-t border-gray-200 px-4 pt-4"
                  style={{ paddingBottom: 16 + insets.bottom }}
                >
                  <Button
                    onPress={form.handleSubmit(onSubmit)}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text>Save Expense</Text>
                    )}
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
