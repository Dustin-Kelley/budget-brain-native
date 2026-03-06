import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text as RNText,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      data.email.toLowerCase()
    );

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert(
      "Check your email",
      "If an account exists with that email, you'll receive a password reset link."
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-background px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-[400px] self-center">
        <Text className="text-center text-3xl font-bold">Reset Password</Text>
        <Text className="mb-8 text-center text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </Text>

        <View className="gap-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <View>
                <Input
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  editable={!form.formState.isSubmitting}
                  className={error ? "border-destructive" : ""}
                />
                {error?.message && (
                  <RNText className="mt-1 text-sm text-destructive">{error.message}</RNText>
                )}
              </View>
            )}
          />

          <Button onPress={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="mt-2">
            {form.formState.isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Send Reset Link</Text>
            )}
          </Button>
        </View>

        <View className="mt-6 items-center">
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text className="text-sm font-semibold">Back to Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
