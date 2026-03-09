import { Button } from "@/components/ui/button";
import { CalendarPicker } from "@/components/CalendarPicker";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { useUpdateIncomeTransaction } from "@/hooks/useUpdateIncomeTransaction";
import { useDeleteIncomeTransaction } from "@/hooks/useDeleteIncomeTransaction";
import { editIncomeTransactionSchema, type EditIncomeTransactionFormData } from "@/lib/validations";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

type EditIncomeTransactionFormProps = {
  transaction: {
    id: string;
    amount: number;
    date: string | null;
    description: string | null;
  };
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditIncomeTransactionForm({
  transaction,
  visible,
  onClose,
  onSuccess,
}: EditIncomeTransactionFormProps) {
  const insets = useSafeAreaInsets();
  const updateMutation = useUpdateIncomeTransaction();
  const deleteMutation = useDeleteIncomeTransaction();

  const dateValue = transaction.date
    ? transaction.date.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const form = useForm<EditIncomeTransactionFormData>({
    resolver: zodResolver(editIncomeTransactionSchema),
    defaultValues: {
      amount: String(transaction.amount ?? 0),
      description: transaction.description ?? "",
      date: dateValue,
    },
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset({
      amount: String(transaction.amount ?? 0),
      description: transaction.description ?? "",
      date: transaction.date ? transaction.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
  }, [transaction, form]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: EditIncomeTransactionFormData) => {
    try {
      await updateMutation.mutateAsync({
        transactionId: transaction.id,
        amount: parseFloat(data.amount),
        description: data.description || undefined,
        dateOfTransaction: data.date,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete payment?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync({ transactionId: transaction.id });
            onSuccess();
            handleClose();
          } catch (error) {
            Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
          }
        },
      },
    ]);
  };

  const isSubmitting = form.formState.isSubmitting || deleteMutation.isPending;

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
                Edit Payment
              </Text>
              <Pressable onPress={handleClose} hitSlop={8} className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200">
                <Ionicons name="close" size={20} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="px-4 py-4">
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
                placeholder="e.g. Weekly paycheck"
                editable={!isSubmitting}
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
