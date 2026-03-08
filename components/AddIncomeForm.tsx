import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { useAddIncome } from "@/hooks/useAddIncome";
import { getAppTheme } from "@/lib/themes";
import { blendHex } from "@/lib/utils";
import { addIncomeSchema, type AddIncomeFormData } from "@/lib/validations";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
  const addIncome = useAddIncome();
  const [visible, setVisible] = useState(false);
  const { appTheme } = useTheme();
  const theme = getAppTheme(appTheme);
  const accentColor = blendHex(theme.colors[0], theme.colors[1]);

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
    try {
      await addIncome.mutateAsync({
        incomeName: data.name,
        incomeAmount: parseFloat(data.amount),
        monthKey,
        householdId,
        userId,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="flex-row gap-2 items-center active:opacity-90"
      >
        <View
          className="items-center justify-center p-1 rounded-full"
          style={{ backgroundColor: accentColor + "20" }}
        >
          <Ionicons name="add" size={20} color={accentColor} />
        </View>
        <Text className="text-md font-medium" style={{ color: accentColor }}>Add income</Text>
      </Pressable>

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
                  Add Income Source
                </Text>
                <Pressable onPress={handleClose} hitSlop={8} className="h-12 w-12 items-center justify-center rounded-full bg-gray-100/80 active:bg-gray-200">
                  <Ionicons name="close" size={20} color="#6B7280" />
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
