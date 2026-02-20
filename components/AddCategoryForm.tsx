import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { addCategory } from "@/lib/mutations/addCategory";
import { Ionicons } from "@expo/vector-icons";
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
  const [visible, setVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCategoryName("");
  };

  const handleClose = () => {
    setVisible(false);
    resetForm();
  };

  const handleSubmit = async () => {
    const name = categoryName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter a category name.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await addCategory({
      categoryName: name,
      monthKey,
      householdId,
    });
    setIsSubmitting(false);

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
        className="flex-row items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 active:bg-gray-50"
      >
        <Ionicons name="add" size={18} color="#374151" />
        <Text className="text-sm font-medium text-gray-700">Add category</Text>
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
                <Pressable onPress={handleClose} hitSlop={12}>
                  <Ionicons name="close" size={24} color="#374151" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-500">
                Add a new category to your budget (e.g. Food, Utilities).
              </Text>
            </View>

            <ScrollView className="px-4 py-4">
              <View className="gap-2">
                <Label>Name *</Label>
                <Input
                  className="rounded-lg px-4 py-3"
                  placeholder="e.g. Groceries, Rent"
                  value={categoryName}
                  onChangeText={setCategoryName}
                  editable={!isSubmitting}
                  autoCapitalize="words"
                />
              </View>
            </ScrollView>

            <View
              className="border-t border-gray-200 px-4 pt-4"
              style={{ paddingBottom: 16 + insets.bottom }}
            >
              <Button onPress={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
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
