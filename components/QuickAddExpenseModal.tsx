import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { CalendarPicker } from "@/components/CalendarPicker";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useAddTransaction } from "@/hooks/useAddTransaction";
import { addExpenseSchema, type AddExpenseFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CategoryWithLineItems } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type QuickAddExpenseModalProps = {
  category: CategoryWithLineItems;
  householdId: string;
  userId: string;
  monthKey: string;
  onClose: () => void;
  onSuccess: () => void;
  preselectedLineItemId?: string | null;
};

export function QuickAddExpenseModal({
  category,
  householdId,
  userId,
  monthKey,
  onClose,
  onSuccess,
  preselectedLineItemId,
}: QuickAddExpenseModalProps) {
  const insets = useSafeAreaInsets();
  const addTransaction = useAddTransaction();
  const lineItems = category.line_items ?? [];
  const defaultLineItemId = preselectedLineItemId ?? lineItems[0]?.id ?? "";

  const [showLineItemPicker, setShowLineItemPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const form = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: "",
      description: "",
      lineItemId: defaultLineItemId,
      date: new Date().toISOString().split("T")[0],
    },
    mode: "onBlur",
  });

  const lineItemId = form.watch("lineItemId");
  const selectedLineItem = lineItems.find((item) => item.id === lineItemId);

  const handleClose = () => {
    setShowLineItemPicker(false);
    setShowDatePicker(false);
    form.reset({
      amount: "",
      description: "",
      lineItemId: defaultLineItemId,
      date: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const onSubmit = async (data: AddExpenseFormData) => {
    try {
      await addTransaction.mutateAsync({
        amount: parseFloat(data.amount),
        description: data.description?.trim() || undefined,
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

  if (showDatePicker) {
    return (
      <>
        <View className="items-center mt-2 mb-1">
          <View className="h-[5px] w-9 rounded-full bg-gray-300" />
        </View>
        <View className="border-b border-gray-100 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <BackButton onPress={() => setShowDatePicker(false)} />
            <Pressable
              onPress={handleClose}
              hitSlop={8}
              className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </Pressable>
          </View>
          <Text className="mt-2 text-lg font-semibold text-gray-800">Select date</Text>
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
    );
  }

  if (showLineItemPicker && lineItems.length > 1) {
    return (
      <>
        <View className="items-center mt-2 mb-1">
          <View className="h-[5px] w-9 rounded-full bg-gray-300" />
        </View>
        <View className="border-b border-gray-100 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <BackButton onPress={() => setShowLineItemPicker(false)} />
            <Pressable
              onPress={handleClose}
              hitSlop={8}
              className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </Pressable>
          </View>
          <Text className="mt-2 text-lg font-semibold text-gray-800">
            Select budget item
          </Text>
        </View>
        <ScrollView className="flex-1 px-4 py-3">
          <View className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {lineItems.map((item, index) => (
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
                  <Ionicons name="checkmark" size={18} color="#4F46E5" />
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </>
    );
  }

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
            onPress={handleClose}
            hitSlop={8}
            className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200"
          >
            <Ionicons name="close" size={20} color="#6B7280" />
          </Pressable>
        </View>
        <Text className="mt-1 text-sm text-gray-500">
          Enter the transaction for this category.
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

          {lineItems.length > 1 ? (
            <Controller
              control={form.control}
              name="lineItemId"
              render={({ fieldState: { error } }) => (
                <View className="gap-2">
                  <Label>Budget item *</Label>
                  <Pressable
                    onPress={() => setShowLineItemPicker(true)}
                    disabled={form.formState.isSubmitting}
                    className={`flex-row items-center justify-between rounded-lg border bg-gray-50 px-4 py-3 ${error ? "border-destructive" : "border-gray-200"}`}
                  >
                    <Text
                      className={
                        selectedLineItem ? "text-gray-800" : "text-gray-400"
                      }
                    >
                      {selectedLineItem?.name ?? "Select budget item"}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                  </Pressable>
                  {error?.message && (
                    <Text className="text-sm text-destructive">{error.message}</Text>
                  )}
                </View>
              )}
            />
          ) : null}

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
                  <Text className={value ? "text-gray-800" : "text-gray-400"}>
                    {value
                      ? new Date(value + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
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
        className="border-t border-gray-200 px-4 pt-4"
        style={{ paddingBottom: 16 + insets.bottom }}
      >
        <Button
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text>Save expense</Text>
          )}
        </Button>
      </View>
    </>
  );
}
