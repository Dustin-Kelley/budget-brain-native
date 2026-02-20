import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { addTransaction } from "@/lib/mutations/addTransaction";
import type { CategoryWithLineItems, LineItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

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
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [lineItemId, setLineItemId] = useState<string | null>(null);
  const [date, setDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [showLineItemPicker, setShowLineItemPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lineItems = flattenLineItems(categories);
  const selectedLineItem = lineItems.find(({ item }) => item.id === lineItemId);

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setLineItemId(null);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleClose = () => {
    setVisible(false);
    setShowLineItemPicker(false);
    resetForm();
  };

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

    setIsSubmitting(true);
    const { error } = await addTransaction({
      amount: amountNum,
      description: description.trim() || undefined,
      lineItemId,
      dateOfTransaction: date.trim(),
      householdId,
      userId,
      monthKey,
    });
    setIsSubmitting(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    onSuccess();
    handleClose();
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full bg-gray-900 shadow-lg active:bg-gray-800"
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
          <View className="h-[90%] rounded-t-2xl bg-white shadow-none">
            <View className="border-b border-gray-200 px-4 py-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  Add New Expense
                </Text>
                <Pressable onPress={handleClose} hitSlop={12}>
                  <Ionicons name="close" size={24} color="#374151" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-500">
                Add a new expense to your budget.
              </Text>
            </View>

            <ScrollView className="max-h-96 px-4 py-4">
              <View className="gap-4">
                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">
                    Amount *
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
                    placeholder="0.00"
                    placeholderTextColor="#9ca3af"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    editable={!isSubmitting}
                  />
                </View>

                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">
                    Description
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
                    placeholder="Optional"
                    placeholderTextColor="#9ca3af"
                    value={description}
                    onChangeText={setDescription}
                    editable={!isSubmitting}
                  />
                </View>

                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">
                    Budget Item *
                  </Text>
                  <Pressable
                    onPress={() =>
                      setShowLineItemPicker((prev) => !prev)
                    }
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
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
                  </Pressable>
                  {showLineItemPicker && (
                    <View className="mt-2 max-h-40 rounded-lg border border-gray-200 bg-gray-50">
                      <ScrollView className="max-h-40">
                        {lineItems.length === 0 ? (
                          <Text className="p-4 text-center text-sm text-gray-500">
                            No budget items. Add categories and line items on the
                            web app.
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

                <View>
                  <Text className="mb-1 text-sm font-medium text-gray-700">
                    Date *
                  </Text>
                  <TextInput
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base"
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                    value={date}
                    onChangeText={setDate}
                    editable={!isSubmitting}
                  />
                </View>
              </View>
            </ScrollView>

            <View className="border-t border-gray-200 px-4 py-4">
              <Button
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Save Expense</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
