import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { useUpdateIncome } from "@/hooks/useUpdateIncome";
import { useDeleteIncome } from "@/hooks/useDeleteIncome";
import { editIncomeSchema, type EditIncomeFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const updateIncomeMutation = useUpdateIncome();
  const deleteIncomeMutation = useDeleteIncome();

  const form = useForm<EditIncomeFormData>({
    resolver: zodResolver(editIncomeSchema),
    defaultValues: {
      name: income.name ?? "",
      amount: String(income.amount ?? 0),
    },
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset({
      name: income.name ?? "",
      amount: String(income.amount ?? 0),
    });
  }, [income, form]);

  const handleClose = () => {
    onClose();
    form.reset({
      name: income.name ?? "",
      amount: String(income.amount ?? 0),
    });
  };

  const onSubmit = async (data: EditIncomeFormData) => {
    try {
      await updateIncomeMutation.mutateAsync({
        incomeId: income.id,
        name: data.name,
        amount: parseFloat(data.amount),
      });
      onSuccess();
      handleClose();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
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
            try {
              await deleteIncomeMutation.mutateAsync({ incomeId: income.id });
              onSuccess();
              handleClose();
            } catch (error) {
              Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
            }
          },
        },
      ]
    );
  };

  const isSubmitting = form.formState.isSubmitting || deleteIncomeMutation.isPending;

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
                Edit Income
              </Text>
              <Pressable onPress={handleClose} hitSlop={8} className="h-9 w-9 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200">
                <Ionicons name="close" size={16} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          <ScrollView className="px-4 py-4">
            <View className="gap-4">
              <FormField
                control={form.control}
                name="name"
                label="Name *"
                placeholder="Income name"
                editable={!isSubmitting}
                autoCapitalize="words"
              />

              <FormField
                control={form.control}
                name="amount"
                label="Amount *"
                placeholder="0"
                keyboardType="decimal-pad"
                editable={!isSubmitting}
              />
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
