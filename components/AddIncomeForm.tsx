import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { addIncome } from "@/lib/mutations/addIncome";
import { addIncomeSchema, type AddIncomeFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
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

type AddIncomeFormProps = {
  householdId: string;
  userId: string;
  monthKey: string;
  onSuccess: () => void;
};

export function AddIncomeForm({
  householdId,
  userId,
  monthKey,
  onSuccess,
}: AddIncomeFormProps) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  const form = useForm<AddIncomeFormData>({
    resolver: zodResolver(addIncomeSchema),
    defaultValues: { name: "", amount: "" },
    mode: "onBlur",
  });

  const handleClose = () => {
    setVisible(false);
    form.reset();
  };

  const onSubmit = async (data: AddIncomeFormData) => {
    const { error } = await addIncome({
      incomeName: data.name,
      incomeAmount: parseFloat(data.amount),
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

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="flex-row gap-2 items-center active:opacity-90"
      >
        <View className="items-center justify-center rounded-full bg-[#36454F]">
          <Ionicons name="add" size={20} color="#fff" />
        </View>
        <Text className="text-sm font-semibold">Add income</Text>
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
                  Add Income Source
                </Text>
                <Pressable onPress={handleClose} hitSlop={12}>
                  <Ionicons name="close" size={24} color="#374151" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-500">
                Add a new income source to your budget.
              </Text>
            </View>

            <ScrollView className="px-4 py-4">
              <View className="gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  label="Name *"
                  placeholder="e.g. Paycheck, Side hustle"
                  editable={!form.formState.isSubmitting}
                  autoCapitalize="words"
                />

                <FormField
                  control={form.control}
                  name="amount"
                  label="Amount *"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  editable={!form.formState.isSubmitting}
                />
              </View>
            </ScrollView>

            <View
              className="border-t border-gray-200 px-4 pt-4"
              style={{ paddingBottom: 16 + insets.bottom }}
            >
              <Button onPress={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Save Income</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
