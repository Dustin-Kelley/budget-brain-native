import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { deleteLineItem } from "@/lib/mutations/deleteLineItem";
import { updateLineItem } from "@/lib/mutations/updateLineItem";
import { editLineItemSchema, type EditLineItemFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LineItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
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
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<EditLineItemFormData>({
    resolver: zodResolver(editLineItemSchema),
    defaultValues: {
      name: lineItem.name ?? "",
      plannedAmount: String(lineItem.planned_amount ?? 0),
    },
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset({
      name: lineItem.name ?? "",
      plannedAmount: String(lineItem.planned_amount ?? 0),
    });
  }, [lineItem, form]);

  const handleClose = () => {
    onClose();
    form.reset({
      name: lineItem.name ?? "",
      plannedAmount: String(lineItem.planned_amount ?? 0),
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete budget item?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            const { error } = await deleteLineItem({ lineItemId: lineItem.id });
            setIsDeleting(false);
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

  const onSubmit = async (data: EditLineItemFormData) => {
    const { error } = await updateLineItem({
      lineItemId: lineItem.id,
      lineItemName: data.name,
      categoryId,
      plannedAmount: parseFloat(data.plannedAmount),
    });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    onSuccess();
    handleClose();
  };

  const isSubmitting = form.formState.isSubmitting || isDeleting;

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
              <Pressable onPress={handleClose} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
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
                placeholder="Item name"
                editable={!isSubmitting}
                autoCapitalize="words"
              />

              <FormField
                control={form.control}
                name="plannedAmount"
                label="Planned Amount *"
                placeholder="0"
                keyboardType="decimal-pad"
                editable={!isSubmitting}
              />
            </View>
          </ScrollView>

          <View
            className="flex-row items-center gap-3 border-t border-gray-200 px-4 pt-4"
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
