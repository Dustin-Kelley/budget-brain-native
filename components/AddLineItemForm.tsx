import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { addLineItem } from "@/lib/mutations/addLineItem";
import { addLineItemSchema, type AddLineItemFormData } from "@/lib/validations";
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

  const form = useForm<AddLineItemFormData>({
    resolver: zodResolver(addLineItemSchema),
    defaultValues: { name: "", plannedAmount: "" },
    mode: "onBlur",
  });

  const handleClose = () => {
    setVisible(false);
    form.reset();
  };

  const onSubmit = async (data: AddLineItemFormData) => {
    const { error } = await addLineItem({
      lineItemName: data.name,
      categoryId,
      plannedAmount: parseFloat(data.plannedAmount),
      monthKey,
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
        className="flex-row items-center gap-2 active:opacity-90"
      >
        <View className="items-center justify-center rounded-full bg-[#36454F]">
          <Ionicons name="add" size={20} color="#fff" />
        </View>
        <Text className="text-sm font-semibold">
          Add item to {categoryName}
        </Text>
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
                <Pressable onPress={handleClose} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                  <Ionicons name="close" size={16} color="#6B7280" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-500">
                Add a new item to {categoryName}.
              </Text>
            </View>

            <ScrollView className="px-4 py-4">
              <View className="gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  label="Name *"
                  placeholder="e.g. Coffee, Gas"
                  editable={!form.formState.isSubmitting}
                  autoCapitalize="words"
                />

                <FormField
                  control={form.control}
                  name="plannedAmount"
                  label="Planned Amount *"
                  placeholder="0"
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
