import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { deleteTransaction } from "@/lib/mutations/deleteTransaction";
import { updateTransaction } from "@/lib/mutations/updateTransaction";
import { editTransactionSchema, type EditTransactionFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CategoryWithLineItems, LineItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TransactionItem = {
  id?: string;
  amount: number | null;
  date: string | null;
  description: string | null;
  line_item_id?: string | null;
  line_items?: { name?: string | null } | null;
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

type EditTransactionFormProps = {
  transaction: TransactionItem;
  categories: CategoryWithLineItems[] | null;
  householdId: string;
  userId: string;
  monthKey: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditTransactionForm({
  transaction,
  categories,
  householdId,
  userId,
  monthKey,
  visible,
  onClose,
  onSuccess,
}: EditTransactionFormProps) {
  const lineItems = flattenLineItems(categories);
  const insets = useSafeAreaInsets();
  const [showLineItemPicker, setShowLineItemPicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getDefaults = () => ({
    amount: String(transaction.amount ?? 0),
    description: transaction.description ?? "",
    lineItemId: transaction.line_item_id ?? "",
    date: transaction.date?.split("T")[0] ?? new Date().toISOString().split("T")[0],
  });

  const form = useForm<EditTransactionFormData>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: getDefaults(),
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset(getDefaults());
  }, [transaction, form]);

  const lineItemId = form.watch("lineItemId");
  const selectedLineItem = lineItems.find(({ item }) => item.id === lineItemId);

  const handleClose = () => {
    onClose();
    form.reset(getDefaults());
  };

  const onSubmit = async (data: EditTransactionFormData) => {
    if (!transaction.id) return;

    const { error } = await updateTransaction({
      transactionId: transaction.id,
      amount: parseFloat(data.amount),
      description: data.description?.trim() || undefined,
      lineItemId: data.lineItemId,
      dateOfTransaction: data.date,
      monthKey,
      householdId,
      userId,
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    onSuccess();
    handleClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete transaction?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!transaction.id) return;
            setIsDeleting(true);
            const { error } = await deleteTransaction({ transactionId: transaction.id });
            setIsDeleting(false);
            if (error) {
              Alert.alert("Error", error.message);
              return;
            }
            onSuccess();
            handleClose();
          },
        },
      ]
    );
  };

  const isSubmitting = form.formState.isSubmitting || isDeleting;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="h-[90%] rounded-t-2xl bg-white shadow-none">
          <View className="border-b border-gray-200 px-4 py-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Edit Transaction
              </Text>
              <Pressable onPress={handleClose} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                <Ionicons name="close" size={16} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="max-h-96 px-4 py-4">
            <View className="gap-4">
              <FormField
                control={form.control}
                name="amount"
                label="Amount *"
                placeholder="0.00"
                keyboardType="decimal-pad"
                editable={!isSubmitting}
              />

              <FormField
                control={form.control}
                name="description"
                label="Description"
                placeholder="Optional"
                editable={!isSubmitting}
              />

              <Controller
                control={form.control}
                name="lineItemId"
                render={({ fieldState: { error } }) => (
                  <View className="gap-2">
                    <Label>Budget Item *</Label>
                    <Pressable
                      onPress={() => setShowLineItemPicker((prev) => !prev)}
                      className={`rounded-lg border bg-gray-50 px-4 py-3 ${error ? "border-destructive" : "border-gray-200"}`}
                    >
                      <Text
                        className={
                          selectedLineItem ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedLineItem
                          ? `${selectedLineItem.categoryName} → ${selectedLineItem.item.name ?? "Item"}`
                          : "Select budget item"}
                      </Text>
                    </Pressable>
                    {showLineItemPicker && (
                      <View className="mt-2 max-h-40 rounded-lg border border-gray-200 bg-gray-50">
                        <ScrollView className="max-h-40">
                          {lineItems.length === 0 ? (
                            <Text className="p-4 text-center text-sm text-gray-500">
                              No budget items.
                            </Text>
                          ) : (
                            lineItems.map(({ item, categoryName }) => (
                              <Pressable
                                key={item.id}
                                onPress={() => {
                                  form.setValue("lineItemId", item.id, { shouldValidate: true });
                                  setShowLineItemPicker(false);
                                }}
                                className="border-b border-gray-100 px-4 py-3 last:border-b-0"
                              >
                                <Text className="font-medium text-gray-900">
                                  {item.name ?? "Item"}
                                </Text>
                                <Text className="text-xs text-gray-500">
                                  {categoryName}
                                </Text>
                              </Pressable>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    )}
                    {error?.message && (
                      <Text className="text-sm text-destructive">{error.message}</Text>
                    )}
                  </View>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                label="Date *"
                placeholder="YYYY-MM-DD"
                editable={!isSubmitting}
              />
            </View>
          </ScrollView>

          <View
            className="flex-row gap-3 border-t border-gray-200 px-4 pt-4"
            style={{ paddingBottom: 16 + insets.bottom }}
          >
            <Pressable
              onPress={handleDelete}
              disabled={isSubmitting}
              className="h-10 w-10 items-center justify-center rounded-full bg-red-100 active:bg-red-200"
            >
              <Ionicons name="trash-outline" size={20} color="#dc2626" />
            </Pressable>
            <Button className="flex-1" onPress={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
              {form.formState.isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Save Changes</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
