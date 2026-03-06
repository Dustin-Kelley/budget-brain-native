import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { useUpdateCategory } from "@/hooks/useUpdateCategory";
import { editCategorySchema, type EditCategoryFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@/types";
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

type EditCategoryFormProps = {
  category: Category;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditCategoryForm({
  category,
  visible,
  onClose,
  onSuccess,
}: EditCategoryFormProps) {
  const insets = useSafeAreaInsets();
  const updateCategoryMutation = useUpdateCategory();

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: { name: category.name ?? "" },
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset({ name: category.name ?? "" });
  }, [category, form]);

  const handleClose = () => {
    onClose();
    form.reset({ name: category.name ?? "" });
  };

  const onSubmit = async (data: EditCategoryFormData) => {
    try {
      await updateCategoryMutation.mutateAsync({
        categoryId: category.id,
        name: data.name,
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
      <View className="flex-1 justify-end bg-black/50">
        <View className="h-[90%] rounded-t-2xl bg-white shadow-none">
          <View className="border-b border-gray-200 px-4 py-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Edit Category
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
                placeholder="Category name"
                editable={!form.formState.isSubmitting}
                autoCapitalize="words"
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
                <Text>Save Changes</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
