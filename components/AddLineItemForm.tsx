import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { addLineItem } from "@/lib/mutations/addLineItem";
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

type AddLineItemFormProps = {
  categoryId: string;
  categoryName: string;
  monthKey: string;
  userId: string;
  onSuccess: () => void;
};

export function AddLineItemForm({
  categoryId,
  categoryName,
  monthKey,
  userId,
  onSuccess,
}: AddLineItemFormProps) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [lineItemName, setLineItemName] = useState("");
  const [plannedAmount, setPlannedAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setLineItemName("");
    setPlannedAmount("");
  };

  const handleClose = () => {
    setVisible(false);
    resetForm();
  };

  const handleSubmit = async () => {
    const name = lineItemName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter an item name.");
      return;
    }
    const amountNum = parseFloat(plannedAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid amount", "Please enter a positive planned amount.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await addLineItem({
      lineItemName: name,
      categoryId,
      plannedAmount: amountNum,
      monthKey,
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

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="flex-row items-center gap-1 py-1"
      >
        <Ionicons name="add-circle-outline" size={18} color="#6b7280" />
        <Text className="text-sm text-gray-600">Add item to {categoryName}</Text>
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
                  Add Budget Item
                </Text>
                <Pressable onPress={handleClose} hitSlop={12}>
                  <Ionicons name="close" size={24} color="#374151" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-500">
                Add a new item to {categoryName}.
              </Text>
            </View>

            <ScrollView className="px-4 py-4">
              <View className="gap-4">
                <View className="gap-2">
                  <Label>Name *</Label>
                  <Input
                    className="rounded-lg px-4 py-3"
                    placeholder="e.g. Coffee, Gas"
                    value={lineItemName}
                    onChangeText={setLineItemName}
                    editable={!isSubmitting}
                    autoCapitalize="words"
                  />
                </View>

                <View className="gap-2">
                  <Label>Planned Amount *</Label>
                  <Input
                    className="rounded-lg px-4 py-3"
                    placeholder="0"
                    value={plannedAmount}
                    onChangeText={setPlannedAmount}
                    keyboardType="decimal-pad"
                    editable={!isSubmitting}
                  />
                </View>
              </View>
            </ScrollView>

            <View
              className="border-t border-gray-200 px-4 pt-4"
              style={{ paddingBottom: 16 + insets.bottom }}
            >
              <Button onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Save Item</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
