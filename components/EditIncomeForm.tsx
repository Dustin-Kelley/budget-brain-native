import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { updateIncome } from "@/lib/mutations/updateIncome";
import { deleteIncome } from "@/lib/mutations/deleteIncome";
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

type EditIncomeFormProps = {
  income: { id: string; name: string | null; amount: number };
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditIncomeForm({
  income,
  visible,
  onClose,
  onSuccess,
}: EditIncomeFormProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(income.name ?? "");
  const [amount, setAmount] = useState(String(income.amount ?? 0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName(income.name ?? "");
    setAmount(String(income.amount ?? 0));
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter an income name.");
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Invalid amount", "Please enter a positive amount.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await updateIncome({
      incomeId: income.id,
      name: trimmed,
      amount: amountNum,
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
      "Delete income?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsSubmitting(true);
            const { error } = await deleteIncome({ incomeId: income.id });
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
                Edit Income
              </Text>
              <Pressable onPress={handleClose} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                <Ionicons name="close" size={16} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="px-4 py-4">
            <View className="gap-4">
              <View className="gap-2">
                <Label>Name *</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="Income name"
                  value={name}
                  onChangeText={setName}
                  editable={!isSubmitting}
                  autoCapitalize="words"
                />
              </View>

              <View className="gap-2">
                <Label>Amount *</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  editable={!isSubmitting}
                />
              </View>
            </View>
          </ScrollView>

          <View
            className="flex-row gap-3 border-t border-gray-200 px-4 pt-4"
            style={{ paddingBottom: 16 + insets.bottom }}
          >
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14"
              onPress={handleDelete}
              disabled={isSubmitting}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </Button>
            <Button className="flex-1" onPress={handleSubmit} disabled={isSubmitting}>
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
