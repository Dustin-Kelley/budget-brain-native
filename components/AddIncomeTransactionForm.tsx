import { Button } from "@/components/ui/button";
import { CalendarPicker } from "@/components/CalendarPicker";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { useAddIncomeTransaction } from "@/hooks/useAddIncomeTransaction";
import { addIncomeTransactionSchema, type AddIncomeTransactionFormData } from "@/lib/validations";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AddIncomeTransactionFormProps = {
  incomeId: string;
  incomeName: string;
  householdId: string;
  userId: string;
  monthKey: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddIncomeTransactionForm({
  incomeId,
  incomeName,
  householdId,
  userId,
  monthKey,
  visible,
  onClose,
  onSuccess,
}: AddIncomeTransactionFormProps) {
  const insets = useSafeAreaInsets();
  const addIncomeTransaction = useAddIncomeTransaction();

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const form = useForm<AddIncomeTransactionFormData>({
    resolver: zodResolver(addIncomeTransactionSchema),
    defaultValues: { amount: "", description: "", date: todayString },
    mode: "onBlur",
  });

  const handleClose = () => {
    onClose();
    form.reset({ amount: "", description: "", date: todayString });
  };

  const onSubmit = async (data: AddIncomeTransactionFormData) => {
    try {
      await addIncomeTransaction.mutateAsync({
        amount: parseFloat(data.amount),
        description: data.description || undefined,
        dateOfTransaction: data.date,
        incomeId,
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="h-[85%] rounded-t-2xl bg-white shadow-none">
          <View className="items-center mt-2 mb-1">
            <View className="h-[5px] w-9 rounded-full bg-gray-300" />
          </View>
          <View className="border-b border-gray-100 px-4 py-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">
                Track Payment
              </Text>
              <Pressable onPress={handleClose} hitSlop={8} className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200">
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <Text className="mt-1 text-sm text-gray-500">
              Log a payment for {incomeName}
            </Text>
          </View>

          <ScrollView className="px-4 py-4">
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
                placeholder="e.g. Weekly paycheck"
                editable={!form.formState.isSubmitting}
                autoCapitalize="sentences"
              />

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">Date *</Text>
                <Controller
                  control={form.control}
                  name="date"
                  render={({ field: { value, onChange } }) => (
                    <CalendarPicker value={value} onSelect={onChange} />
                  )}
                />
                {form.formState.errors.date && (
                  <Text className="text-sm text-red-500">
                    {form.formState.errors.date.message}
                  </Text>
                )}
              </View>
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
                <Text>Save Payment</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
