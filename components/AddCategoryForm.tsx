import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { useAddCategory } from "@/hooks/useAddCategory";
import { addCategorySchema, type AddCategoryFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
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
import { useState } from "react";

type AddCategoryFormProps = {
  householdId: string;
  monthKey: string;
  onSuccess: () => void;
};

export function AddCategoryForm({
  householdId,
  monthKey,
  onSuccess,
}: AddCategoryFormProps) {
  const insets = useSafeAreaInsets();
  const addCategory = useAddCategory();
  const [visible, setVisible] = useState(false);

  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: { categoryName: "" },
    mode: "onBlur",
  });

  const handleClose = () => {
    setVisible(false);
    form.reset();
  };

  const onSubmit = async (data: AddCategoryFormData) => {
    try {
      await addCategory.mutateAsync({
        categoryName: data.categoryName,
        monthKey,
        householdId,
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
        className="flex-row items-center gap-2 active:opacity-90"
      >
        <View className="items-center justify-center rounded-full bg-[#36454F]">
          <Ionicons name="add" size={20} color="#fff" />
        </View>
        <Text className="text-sm font-semibold">Add category</Text>
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
                  Add Category
                </Text>
                <Pressable onPress={handleClose} hitSlop={8} className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200">
                  <Ionicons name="close" size={16} color="#6B7280" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-500">
                Add a new category to your budget (e.g. Food, Utilities).
              </Text>
            </View>

            <ScrollView className="px-4 py-4">
              <FormField
                control={form.control}
                name="categoryName"
                label="Name *"
                placeholder="e.g. Groceries, Rent"
                editable={!form.formState.isSubmitting}
                autoCapitalize="words"
              />
            </ScrollView>

            <View
              className="border-t border-gray-200 px-4 pt-4"
              style={{ paddingBottom: 16 + insets.bottom }}
            >
              <Button onPress={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Save Category</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
