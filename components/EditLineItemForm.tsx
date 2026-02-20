import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { updateLineItem } from "@/lib/mutations/updateLineItem";
import type { LineItem } from "@/types";
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

type EditLineItemFormProps = {
  lineItem: LineItem;
  categoryId: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditLineItemForm({
  lineItem,
  categoryId,
  visible,
  onClose,
  onSuccess,
}: EditLineItemFormProps) {
  const insets = useSafeAreaInsets();
  const [lineItemName, setLineItemName] = useState(lineItem.name ?? "");
  const [plannedAmount, setPlannedAmount] = useState(
    String(lineItem.planned_amount ?? 0)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setLineItemName(lineItem.name ?? "");
    setPlannedAmount(String(lineItem.planned_amount ?? 0));
  };

  const handleClose = () => {
    onClose();
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
    const { error } = await updateLineItem({
      lineItemId: lineItem.id,
      lineItemName: name,
      categoryId,
      plannedAmount: amountNum,
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
                Edit Budget Item
              </Text>
              <Pressable onPress={handleClose} hitSlop={12}>
                <Ionicons name="close" size={24} color="#374151" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="px-4 py-4">
            <View className="gap-4">
              <View className="gap-2">
                <Label>Name *</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="Item name"
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
                <Text>Save Changes</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
