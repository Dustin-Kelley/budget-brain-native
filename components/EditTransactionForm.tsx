import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { deleteTransaction } from "@/lib/mutations/deleteTransaction";
import { updateTransaction } from "@/lib/mutations/updateTransaction";
import type { CategoryWithLineItems, LineItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

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
  const [amount, setAmount] = useState(String(transaction.amount ?? 0));
  const [description, setDescription] = useState(
    transaction.description ?? ""
  );
  const [lineItemId, setLineItemId] = useState<string | null>(
    transaction.line_item_id ?? null
  );
  const [date, setDate] = useState(
    transaction.date?.split("T")[0] ?? new Date().toISOString().split("T")[0]
  );
  const insets = useSafeAreaInsets();
  const [showLineItemPicker, setShowLineItemPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLineItem = lineItems.find(({ item }) => item.id === lineItemId);

  const handleClose = () => {
    onClose();
    setAmount(String(transaction.amount ?? 0));
    setDescription(transaction.description ?? "");
    setLineItemId(transaction.line_item_id ?? null);
    setDate(
      transaction.date?.split("T")[0] ?? new Date().toISOString().split("T")[0]
    );
  };

  const handleUpdate = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid amount", "Please enter a positive number.");
      return;
    }
    if (!lineItemId) {
      Alert.alert("Budget item required", "Please select a budget item.");
      return;
    }
    if (!transaction.id) return;

    setIsSubmitting(true);
    const { error } = await updateTransaction({
      transactionId: transaction.id,
      amount: amountNum,
      description: description.trim() || undefined,
      lineItemId,
      dateOfTransaction: date.trim(),
      monthKey,
      householdId,
      userId,
    });
    setIsSubmitting(false);

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
            setIsSubmitting(true);
            const { error } = await deleteTransaction({ transactionId: transaction.id });
            setIsSubmitting(false);
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
              <Pressable onPress={handleClose} hitSlop={12}>
                <Ionicons name="close" size={24} color="#374151" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="max-h-96 px-4 py-4">
            <View className="gap-4">
              <View className="gap-2">
                <Label>Amount *</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="0.00"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  editable={!isSubmitting}
                />
              </View>

              <View className="gap-2">
                <Label>Description</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="Optional"
                  value={description}
                  onChangeText={setDescription}
                  editable={!isSubmitting}
                />
              </View>

              <View className="gap-2">
                <Label>Budget Item *</Label>
                <Pressable
                  onPress={() => setShowLineItemPicker((prev) => !prev)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
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
                              setLineItemId(item.id);
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
              </View>

              <View className="gap-2">
                <Label>Date *</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="YYYY-MM-DD"
                  value={date}
                  onChangeText={setDate}
                  editable={!isSubmitting}
                />
              </View>
            </View>
          </ScrollView>

          <View
            className="gap-2 border-t border-gray-200 px-4 pt-4"
            style={{ paddingBottom: 16 + insets.bottom }}
          >
            <Button onPress={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Save Changes</Text>
              )}
            </Button>
            <Button
              variant="destructive"
              onPress={handleDelete}
              disabled={isSubmitting}
            >
              <Text>Delete Transaction</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
