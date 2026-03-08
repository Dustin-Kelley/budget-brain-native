import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ColorPicker";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { CATEGORY_COLORS } from "@/lib/constants";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { useUpdateCategory } from "@/hooks/useUpdateCategory";
import { editCategorySchema, type EditCategoryFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@/types";
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
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: { name: category.name ?? "", color: category.color ?? CATEGORY_COLORS[0] },
    mode: "onBlur",
  });

  const handleClose = () => {
    onClose();
    form.reset({ name: category.name ?? "", color: category.color ?? CATEGORY_COLORS[0] });
  };

  const onSubmit = async (data: EditCategoryFormData) => {
    try {
      await updateCategory({
        categoryId: category.id,
        name: data.name,
        color: data.color,
      });
      onSuccess();
      handleClose();
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Category",
      `Are you sure you want to delete "${category.name}"? This will also delete all line items in this category.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory({ categoryId: category.id });
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

  const isSubmitting = form.formState.isSubmitting || isDeleting;

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
                Edit Category
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
                name="name"
                label="Name *"
                placeholder="Category name"
                editable={!isSubmitting}
                autoCapitalize="words"
              />
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">Color</Text>
                <ColorPicker
                  selectedColor={form.watch("color")}
                  onSelectColor={(c) => form.setValue("color", c)}
                />
              </View>
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
