import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/auth-context";
import { logError } from "@/hooks/useLogError";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

export default function LoginScreen() {
  const { sendOtp } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await sendOtp(data.email.toLowerCase());

    if (error) {
      logError(error, { tags: { feature: 'auth' } });
      Alert.alert("Error", error.message);
      return;
    }

    router.push({ pathname: "/(auth)/verify-otp", params: { email: data.email.toLowerCase() } });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center bg-background px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full max-w-[400px] self-center">
        <Logo />
        <Text className="mt-6 text-center text-3xl font-bold">Budget Brain</Text>
        <Text className="mb-8 text-center text-lg text-muted-foreground">
          Enter your email to get started
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
                  <Text className="mt-1 text-sm text-destructive">{error.message}</Text>
                )}
              </View>
            )}
          />

          <Button variant="secondary" onPress={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="mt-2">
            {form.formState.isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text>Continue</Text>
            )}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
