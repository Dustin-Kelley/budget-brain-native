import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations";
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

type ChangePasswordFormProps = {
  visible: boolean;
  onClose: () => void;
};

export function ChangePasswordForm({
  visible,
  onClose,
}: ChangePasswordFormProps) {
  const insets = useSafeAreaInsets();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    const { error } = await supabase.auth.updateUser({ password: data.newPassword });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Your password has been updated.");
    handleClose();
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
                Change Password
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
                name="newPassword"
                label="New Password *"
                placeholder="Min 6 characters"
                secureTextEntry
                editable={!form.formState.isSubmitting}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                label="Confirm Password *"
                placeholder="Re-enter password"
                secureTextEntry
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
                <Text>Update Password</Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
